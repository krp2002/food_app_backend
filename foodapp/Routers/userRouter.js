const { application } = require('express');
const express = require('express');
const userRouter=express.Router();
const multer = require('multer');
const {getUser,getAllUser,updateUser,deleteUser,updateProfileImage} = require('../controller/userController');
// const protectRout=require('./authHelper');
const{signup,login,isAuthorised,protectRout,forgetpassword,resetpassword,logout} = require('../controller/authController');
const { functionsIn } = require('lodash');

// user ke options
userRouter.route('/:id')
.patch(updateUser)
.delete(deleteUser)

userRouter
.route('/signup')
.post(signup)

userRouter
.route('/login')
.post(login)

// forget password
userRouter
.route('/forgetpassword')
.post(forgetpassword)

// reset password
userRouter
.route('/resetpassword/:token')
.post(resetpassword)

userRouter
.route('/logout')
.get(logout)

// multer for file upload
// upload->storage, filter

const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter = function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not an image! please upload an image"), false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter: filter
}); 

userRouter.post("/ProfileImage", upload.single('photo'), updateProfileImage);
// get Request
userRouter.get('/ProfileImage',(req,res)=>{
    res.sendFile('multer.html', {root:__dirname});
})

// profile page
userRouter.use(protectRout);
userRouter
.route('/userProfile')
.get(getUser)


// admin specific function
userRouter.use(isAuthorised(['admin']));
userRouter
.route('')
.get(getAllUser)


module.exports=userRouter;