const jwt = require('jsonwebtoken');
const {Access_Token_Secret,Refresh_Token_Secret} = require('../config/index');
const RefreshToken = require('../models/token');

class JWTService{
    // Sign Access Token
    static signAccessToken(payload,expiryTime,secret=Access_Token_Secret){
        return jwt.sign(payload,secret,{expiresIn:expiryTime});
    }

    //  Sign Refresh Token
    static signRefreshToken(payload,expiryTime,secret=Refresh_Token_Secret){
        return jwt.sign(payload,secret,{expiresIn:expiryTime});
    }

    // Verify Access Token
    static verifyAccessToken(token){
        return jwt.verify(token,Access_Token_Secret);
    }

    //verify Refresh Token
    static verifyRefreshToken(token,Refresh_Token_Secret){
        return jwt.verify(token,Refresh_Token_Secret);
    }

    //  Store Refresh Token
    static async storeRefreshToken(token,userId){
        try{
            const newToken = new RefreshToken({
                token:token,
                userId:userId
            });
            // Store in DB
            await newToken.save();
        }catch(error){
            console.log(error);
        }
    }

}

module.exports = JWTService;