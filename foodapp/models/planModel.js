const mongoose=require('mongoose');

const db_link = 'mongodb+srv://krunal_patel_6822:NwMYsYAVL3gXUGoQ@cluster0.kxysywk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('plan database connected');
})
.catch(function(err){
    console.log(err);
});

const planSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should not exceed more than 20 characters']
    },
    duration:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:[true,'price not entered'],
    },
    ratingsAverage:{
        type:Number,
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100
        },'discount should not exceed price']
    }
});

// model
const planModel=mongoose.model("planModel",planSchema);

module.exports=planModel;