const JWTService = require("../services/jwtservice");
const User = require("../models/user");
const UserDTO = require("../dto/user");

const auth = async (req, res, next) => {

  try {
    const accessToken = req.headers['accesstoken'];

    const refreshToken = req.headers['refreshtoken'];

    // console.log(req.headers);
    
    // valiation of refresh and access token
    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    let _id;

    try{
      _id = JWTService.verifyAccessToken(accessToken)._id;
    }catch(error){
     return res.status(201).json({error:'Token Expired'});
    }

    let user;

    try{
      user = await User.findOne({ _id: _id });
    } catch (error) {
      return next(error);
    }

    const userDTO = new UserDTO(user);

    req.user = userDTO;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
