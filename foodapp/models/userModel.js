const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const bcrypt = require('bcrypt');
const crypto=require('crypto');
const { rest } = require('lodash');

const db_link = 'mongodb+srv://krunal_patel_6822:NwMYsYAVL3gXUGoQ@cluster0.kxysywk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('user database connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8   
    },
    confirmpassword:{
        type:String,
        required:true,  
        minLength:8,
        validate:function(){
            return this.confirmpassword==this.password;
        }
    },
    role:{
        type:String,
        enum:['admin','user','restaurantowner','deliveryboy'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'img/users/default.jpeg'
    },

    resetToken:String
})

userSchema.pre('save',function(){
    this.confirmpassword=undefined;
})


userSchema.methods.createResetToken=function(){
    // creating unique token using npm i crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler=function(password,confirmpassword){
    this.password = password;
    this.confirmpassword = confirmpassword;
    this.resetToken=undefined;
}

// model
const userModel=mongoose.model('userModel',userSchema);
module.exports=userModel;
