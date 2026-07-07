const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author of the review to the current user
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review created 🎉");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res) => {
        let {id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //$pull operator removes from an existing array all instances of a value or values that match a specified condition. In this case, it removes the reviewId from the reviews array of the listing with the given id.
        await Review.findByIdAndDelete(reviewId);

        req.flash("deleted", "Review Deleted 💥");
        res.redirect(`/listings/${id}`);
    }