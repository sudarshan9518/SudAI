/*
middleware to use authenticate a user when doing a things on application 

*/

const userModel  = require("../models/user.model")
const jwt  = require("jsonwebtoken")





async function authUser(req, res, next) {
    const{token} = req.cookies;

    if(!token){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    try{

        const decode = jwt.verify(token, process.env.JWTSECRET)

        const user = await userModel.findById(decode.id)

        req.user = user


        next()




    }catch(err){
        res.status(401).json({
            message :"Unauthorized "
        })
        
    }
    
}

module.exports = {
    authUser
}