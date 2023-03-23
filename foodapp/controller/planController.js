const planModel = require('../models/planModel');

// get all plans
module.exports.getAllPlans = async function getAllPlans(req,res){
    try{
        let plans = await planModel.find();
        if(plans){
            return res.json({
                message:'all plans retrived',
                data:plans
            })
        }else{
            return res.json({
                message:'plans not found'
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

// get plan
module.exports.getPlan = async function getPlan(req,res){
    try{
        let id = req.params.id;
        let plan = await planModel.findById(id);
        if(plan){
            return res.json({
                message:'plan retrived',
                data:plan
            })
        }else{
            return res.json({
                message:'plan not found'
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

// creat plan
module.exports.createPlan = async function createPlan(req,res){
    try{
        let planData = req.body;
        let createdPlan = await planModel.create(planData);
        return res.json({
            message:'plan cerated successfully',
            data: createdPlan
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

// delete plan
module.exports.deletePlan = async function deletePlan(req,res){
    try{
        let id= req.params.id;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        return res.json({
            message:'plan deleted successfully',
            data: deletedPlan
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

// update plan
module.exports.updatePlan = async function updatePlan(req,res){
    try{
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        console.log(id);
        console.log(dataToBeUpdated);  
        let keys= [];
        for(let key in dataToBeUpdated){
            keys.push(key);
        }  
        let plan = await planModel.findById(id);
        for(let i=0; i<keys.length; i++){
            plan[keys[i]]=dataToBeUpdated[keys[i]];
        }
        console.log(plan);
        await plan.save();
        return res.json({
            message:'plan updated successfully',
            data:plan
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

// get top 3 plans
module.exports.top3Plans = async function top3Plans(req,res){
    try{
        const plans = await planModel.find().sort({
            ratingsAverage:-1
        }).limit(3);

        return res.json({
            message:'top3 plans',
            data:plans
        })

    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}