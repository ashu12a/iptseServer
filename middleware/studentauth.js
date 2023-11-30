const JWTService = require("../services/jwtservice");
const Students = require("../models/students");
const UserDTO = require("../dto/user");

const auth = async (req, res, next) => {

  try {
    const accessToken = req.headers['accesstoken'];

    // console.log(accessToken);
    
    // valiation of refresh and access token
    if (!accessToken) {
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
      user = await Students.findOne({ _id: _id });
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
