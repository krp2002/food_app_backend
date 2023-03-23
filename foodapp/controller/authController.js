const express = require('express');
// const authRouter=express.Router();
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../secrets');
const { sendMail } = require('../utility/nodemailer');
const { ConnectionStates, model } = require('mongoose');
const { findOne } = require('../models/userModel');
const userRouter = require('../Routers/userRouter');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

// signup user
module.exports.signup = async function signup(req, res) {
    try {
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        sendMail("signup", user);
        if (user) {
            return res.json({
                message: "user signed up",
                data: user
            });
        }
        else {
            res.json({
                message: 'error while signingup'
            });
        }
        // console.log('backend',user);

    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

// login user
module.exports.login = async function login(req, res) {
    try {
        let data = req.body;
        if (data.email) {
            let user = await userModel.findOne({ email: data.email });
            if (user) {
                // bcrypt -> compare
                if (user.password == data.password) {
                    let uid = user['_id']; //uid
                    let token = jwt.sign({ payload: uid }, JWT_KEY);
                    res.cookie('login', token, { httpOnly: true });
                    return res.json({
                        message: 'user has loggedin',
                        userDetails: data
                    });
                } else {
                    return res.json({
                        message: 'wrong credentials'
                    });
                }
            } else {
                return res.json({
                    message: 'user not found'
                });

            }
        }
        else {
            return res.json({
                message: 'empty field found'
            })
        }

    }

    catch (err) {
        return res.json({
            message: err.message,
        })
    }
}

// isAuthorised -> to check the user's role [admin, user, owner, delivery boy]
module.exports.isAuthorised = function isAuthorised(roles) {
    return function (req, res, next) {
        if (roles.includes(req.role) == true) {
            next();
        }
        else {
            res.status(401).json({
                message: 'operation not allowed'
            });
        }
    }
}

// protectRoute
module.exports.protectRout = async function protectRout(req, res, next) {
    try {
        let token;
        if (req.cookies.login) {
            console.log(req.cookies);
            token = req.cookies.login;
            let payload = jwt.verify(token, JWT_KEY);
            if (payload) {
                console.log('payload token :', payload);
                const user = await userModel.findById(payload.payload);
                req.role = user.role;
                req._id = user._id;
                console.log(req.role, req._id);
                next();
            }
            else {
                return res.json({
                    message: 'user not verified'
                })
            }
        } else {
            const client = req.get('User-Agent');
            if(client.includes("Mozilla")==true){
                return res.redirect('/login');
            }
            res.json({
                message: "please login"
            });
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        });
    }

}

// forgetpassword
module.exports.forgetpassword = async function forgetpassword(req, res) {
    let { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            const resetToken = user.createResetToken();
            let resetPasswordLink = `${req.protocol}://${req.get(
                "host"
                )}/resetpassword/${resetToken}`;

            let obj = {
                resetPasswordLink:resetPasswordLink,
                email:email
            }

            sendMail("resetpassword",obj);
            return res.json({
                message:"password reset succesfully"
            })
            // send email to user
            // nodemailer
        }
        else {
            return res.json({
                message: "please signup"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

// reset password
module.exports.resetpassword =  async function resetpassword(req, res) {
    try {
        const token = req.params.token;
        let { password, confirmpassword } = req.body;
        const user = await userModel.findOne({ resetToken: token });
        if (user) {
            // reset password heandelar will update user in db
            user.resetPasswordHandler(password, confirmpassword);
            await user.save();

            res.json({
                message: "passeord change successfully please login again"
            })
        }
        else{
            res.json({
                message:"user not found"
            })
        }
    }
    catch (err) {
        res.json({
            message: err.message,
        });
    }
}

// for logout
module.exports.logout = function logout(req,res){
    res.cookie('login','',{maxAge:1});
    res.json({
        message:"user logged out successfully"
    })
}