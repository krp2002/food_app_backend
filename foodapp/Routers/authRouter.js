const express = require('express');
const authRouter=express.Router();
const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const JWT_KEY=require('../secrets');

// const userModel = require('./foodapp/models/userModel');


authRouter
.route("/signup")
.get(middleware,getSignUp)
.post(postSignUp);

authRouter
.route("/login")
.post(loginUser)

function middleware(req,res,next){
    console.log('middleware encountered');
    next();
}

function getSignUp(req,res){
    console.log('get called')
    res.sendFile('/public/index.html',{root:__dirname});
}

async function postSignUp(req,res){
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    // console.log('backend',user);
    res.json({
        message:"user signed up",
        data:user
    });   
}    

async function loginUser(req,res){
    try{
        let data= req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
        // bcrypt -> compare
                if(user.password==data.password){
                    let uid = user['_id']; //uid
                    let token=jwt.sign({payload:uid},JWT_KEY);
                    res.cookie('login',token,{httpOnly:true});
                    return res.json({
                        message:'user has loggedin',
                        userDetails:data
                    });
                }else{
                    return res.json({
                        message:'wrong password'
                    });
                }
            }else{
                return res.json({
                    message:'user not found'
                });
            
            }   
        }
        else{
            return res.json({
                message:'empty field found'
            })
        }

    }

    catch(err){
        return res.json({
            message:err.message,
        })
    }
}

module.exports=authRouter;