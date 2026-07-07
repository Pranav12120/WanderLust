const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { urlencoded } = require("express");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}}); //This line deletes all the reviews associated with the listing that was deleted. It uses the $in operator to find all reviews whose _id is in the listing.reviews array and deletes them from the Review collection.
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;