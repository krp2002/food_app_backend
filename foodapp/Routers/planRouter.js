// const { application } = require('express');
const express = require('express');
const planRouter=express.Router();
// const{protectRoute, isAuthorised} = require('../controller/authController');
const{protectRout,isAuthorised}=require('../controller/authController');
const{getPlan,getAllPlans,createPlan,deletePlan,updatePlan,top3Plans} = require('../controller/planController');

// all plan leke ayega
planRouter
.route('/allPlan')
.get(getAllPlans)

// own plan -> loggedin necessary
planRouter.use(protectRout);
planRouter
.route('/plan/:id')
.get(getPlan);


// admin and owner can only creat,edit,delete plans 
planRouter.use(isAuthorised(['admin','restaurantowner']));
planRouter
.route('/crudPlan')
.post(createPlan)

planRouter
.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan)

planRouter
.route('/top3')
.get(top3Plans)

module.exports=planRouter;