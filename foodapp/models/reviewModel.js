const mongoose=require('mongoose');

const db_link = 'mongodb+srv://krunal_patel_6822:NwMYsYAVL3gXUGoQ@cluster0.kxysywk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('user database connected');
})
.catch(function(err){
    console.log(err);
});

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true, 'review is required']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true, 'rating is required']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'userModel',
        required:[true, 'review must belongs to user']
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:'planModel',
        required:[true, 'review must belongs to plan']
    }
});

// find by id, findone
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:"user",
        select:"name profileImage"
    }).populate("plan");
    next();
})

const reviewModel = mongoose.model('reviewModel',reviewSchema);

module.exports=reviewModel;