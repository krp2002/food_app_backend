const express = require('express');
const reviewRouter=express.Router();

const{protectRout}=require('../controller/authController');
const{getAllReviews,top3reviews,getPlanReviews,createReview,updateReview,deleteReview} = require('../controller/reviewController');

reviewRouter
.route('/all')
.get(getAllReviews);

reviewRouter
.route('/top3')
.get(top3reviews);

reviewRouter
.route('/:id')
.get(getPlanReviews);

reviewRouter.use(protectRout)
reviewRouter
.route('/crud/:plan')
.post(createReview)
.patch(updateReview)
.delete(deleteReview)

module.exports=reviewRouter;
