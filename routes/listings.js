const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');//multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); //multer is configured to use the Cloudinary storage engine defined in cloudConfig.js, which allows uploaded files to be stored directly in a Cloudinary account instead of the local file system.

router
    .route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing)); //create route
   
//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .put(isLoggedIn,isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) //update route
    .delete(isLoggedIn ,isOwner, wrapAsync(listingController.destroyListing)); //delete route

//Edit Route
router.get("/:id/edit", isLoggedIn ,isOwner ,wrapAsync(listingController.renderEditForm));

module.exports = router;
