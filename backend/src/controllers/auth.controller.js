const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")




async function registerUser(req, res) {
    const {fullName:{firstName, lastName}, email, password} = req.body;


    const isUserAlradyExists = await userModel.findOne({email})

    if(isUserAlradyExists){
       return res.status(400).json({
            message:"user alrady register"
        
        })
    }

    const hashPassword = await bcrypt.hash(password,10)


    const user = await userModel.create({
        fullName:{
            firstName, lastName
        },
        email,
        password : hashPassword


    })

    const token = jwt.sign({
        id:user._id},

        process.env.JWTSECRET

    )
    res.cookie("token", token)

    res.status(201).json({
        message :"User  Generated Successfully",
        user:{
            email: user.email,
            _id : user._id,
            fullName :user.fullName

        }
    })
    
}

async function loginUser(req, res) {
    const {email, password} = req.body
    const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            message  :"invalid user and passoword"
        })
    }

    const isPasswordIsCValid = await bcrypt.compare(password, user.password)

    if(!isPasswordIsCValid){
         return res.status(400).json({
            message  :"invalid user and passoword"
        })
    }

    const token = jwt.sign({ id : user._id}, process.env.JWTSECRET)

    res.cookie("token", token)

    res.status(201).json({
        message :"user is login ",
        
       user :{
         email : user.email,
        _id : user._id,
        fullName : user.fullName
       }

        
    })
    
}

module.exports = {
    registerUser,
    loginUser
}