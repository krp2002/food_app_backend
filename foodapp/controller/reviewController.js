const planModel = require("../models/planModel");
const reviewModel = require("../models/reviewModel");


module.exports.getAllReviews = async function getAllReviews(req, res) {
    try {
        const reviews = await reviewModel.find();
        if (reviews) {
            return res.json({
                message: "reviews retrived",
                data: reviews,
            })
        }
        else {
            return res.json({
                message: "review not found"
            })
        }
    }

    catch (err) {
        return res.json({
            message: err.message,
        });
    }
}

module.exports.top3reviews = async function top3reviews(req, res) {
    try {
        const reviews = await reviewModel.find().sort({
            rating: -1
        }).limit(3);
        if (reviews) {
            return res.json({
                message: "reviews retrived",
                data: reviews,
            })
        }
        else {
            return res.json({
                message: "review not found"
            })
        }
    }

    catch (err) {
        return res.json({
            message: err.message,
        });
    }
}

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
    try {
        const planid = req.params.id;
        console.log("plan id", planid);
        let reviews = await reviewModel.find();

        reviews = reviews.filter(review => review.plan["_id"] == planid);
        // console.log(reviews);
        return res.json({
            data: reviews,
            message: 'reviews retrieved for a particular plan successful'
        });
    }
    catch (err) {
        return res.json({
            message: err.message
        });
    }
}

// module.exports.getPlanReviews = async function getPlanReviews(req, res) {
//     try {
//         const id = req.params.id;
//         const review = await reviewModel.findById(id);
//         if (review) {
//             return res.json({
//                 message: "reviews retrived",
//                 data: review,
//             })
//         }
//         else {
//             return res.json({
//                 message: "review not found"
//             })
//         }
//     }

//     catch (err) {
//         return res.json({
//             message: err.message,
//         });
//     }
// }

module.exports.createReview = async function createReview(req, res) {

    try {
        let id = req.params.plan;
        let plan = await planModel.findById(id);
        let review = await reviewModel.create(req.body);

        plan.ratingsAverage = (plan.ratingsAverage + req.body.rating) / 2;
        await plan.save();

        res.json({
            message: "review created",
            data: review,
        });
    }

    catch (err) {
        return res.json({
            message: err.message,
        });
    }
}

module.exports.updateReview = async function updateReview(req, res) {
    try {
        let planid = req.params.id;
        // review id form forntend
        let id = req.body.id;

        let dataToBeUpdated = req.body;
        // console.log(id);
        // console.log(dataToBeUpdated);  
        let keys = [];
        for (let key in dataToBeUpdated) {
            if(key=='id') continue;
            keys.push(key);
        }
        let review = await reviewModel.findById(id);
        for (let i = 0; i < keys.length; i++) {
            review[keys[i]] = dataToBeUpdated[keys[i]];
        }
        // console.log(plan);
        await review.save();
        return res.json({
            message: 'review updated successfully',
            data: review
        })
    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }

}

module.exports.deleteReview = async function deleteReview(req, res) {

    try {
        let planid = req.params.plan;
        // review id form forntend
        let id = req.body.id;

        let review = await reviewModel.findByIdAndDelete(id);

        res.json({
            message: "review deleted",
            data: review,
        });
    }

    catch (err) {
        return res.json({
            message: err.message,
        });
    }
}