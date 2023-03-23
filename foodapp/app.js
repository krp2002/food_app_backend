const express = require('express');
const { update } = require('lodash');
const app=express();

const { response } = require('express');
const cookieParser=require('cookie-parser');

// middleware func => post, fonrtend => json 
app.use(express.json());
app.listen(3000);
app.use(cookieParser());


const userRouter=require('./Routers/userRouter');
const authRouter=require('./Routers/authRouter');
const planRouter=require('./Routers/planRouter');
const reviewRouter=require('./Routers/reviewRouter');
// base rout, router to use
app.use("/user",userRouter);
app.use("/auth",authRouter);
app.use("/plans",planRouter);
app.use("/review",reviewRouter);

// const planModel=require('./models/planModel');