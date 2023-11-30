const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const JoiPassword = Joi.extend(joiPasswordExtendCore);
const JWTService = require("../services/jwtservice");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const UserDTO = require("../dto/user");
const RefreshToken = require("../models/token");

const authController = {
  // -----------------------Register a New User -------------------------
  async register(req, res, next) {
    // Creating UserRegister Schema
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      role: Joi.string().required(),
      password: JoiPassword.string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .required(),
      confirmPassword: Joi.ref("password"),
    });

    // validate user input
    const { error } = userRegisterSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    // if email or username already registeredb-> return an error
    const { username, name, email, role, password } = req.body;
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email",
        };
        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available, choose another username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // store data in DB
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username: username,
        email: email,
        role: role,
        name: name,
        password: hashedPassword,
      });

      user = await userToRegister.save();
      //Token Generation
      // accessToken = JWTService.signAccessToken({ _id: user._id }, "10m");
      // refreshToken = JWTService.signRefreshToken({ _id: user._id }, "10m");
    } catch(error) {
      return next(error);
    }

    //Store Refresh token in DB
    await JWTService.storeRefreshToken(refreshToken, user._id);
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true, // for XSS attack Secure
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true, // for XSS attack Secure
    });

    // send a response
    const userDTO = new UserDTO(user);

    return res.status(201).json({ user: userDTO, auth: true });
  },
  // --------------------------Login User -------------------------------
  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      password: JoiPassword.string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .required(),
    });

    // validate user input
    const { error } = userLoginSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    let user;

    try {
      // compare username
      user = await User.findOne({ username: username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid Username !",
        };
        return next(error);
      }

      // comapare password

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password !",
        };
        return next(error);
      }
    }catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "2880m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "2880m");

    //Update Refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        {
          token: refreshToken,
        },
        {
          upsert: true, // update OR create New
        }
      );
    } catch (error) {
      next(error);
    }

    return res.status(200).json({refreshToken,accessToken});
  },

  // ---------------------------Users Role ------------------------------

  async role(req, res, next) {
    const roleSchema = Joi.object({
      name: Joi.string().min(1).max(20).required(),
    });

    const { error } = roleSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name } = req.body;

    const roleToRegister = new Role({
      name: name,
    });

    const role = await roleToRegister.save();

    return res.status(201).json(role);
  },

  // -----------------------------LogOut the User ----------------------

  async logout(req, res, next) {
    // Delete Refresh Token from DB

    const { refreshToken } = req.cookies;

    try{
      await RefreshToken.delete.One({ token: refreshToken });
    } catch (error) {
      next(error);
    }


    //delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // response
    return res.send(200);
  },

  // -------------------------------Refresh the Token -----------------------
  async refresh(req, res, next) {
    const OriginalRefreshToken = req.cookies.refreshToken;

    let id;
    try {
      id = JWTService.verifyRefreshToken(OriginalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: OriginalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (error) {
      return next(error);
    }

    const user = await User.findOne({ _id: id });

    const userDTO = new UserDTO(user);

    res.status(200).json({ user: userDTO, auth: true });
  },
};

module.exports = authController;
