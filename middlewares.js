const Listing = require("./models/listing"); 
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./Schema.js");
const ExpressError= require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL in the session - this line is used to redirect the user to the original path after they log in. 
        req.flash("error", "You must be logged-in to proceed further ☹️");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; //passport doesn't have access to delete the local variable. thats why we store the redirectUrl in res.locals so that we can access it in the login route
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "only owners have permission to edit/delete this listing ☹️");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body); //validates the data sent inside the HTTP request using the listingSchema defined in Schema.js
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body); 
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "only the author of the review can delete it ☹️");
        return res.redirect(`/listings/${id}`);
    }

    next();
};