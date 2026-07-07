const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
const mapAPIKey = process.env.MAP_API_KEY;
maptilerClient.config.apiKey = mapAPIKey;

module.exports.index = async (req,res) => {
        const { q } = req.query;
        let allListings;

        if (q && q.trim() !== "") {
            const searchTerm = q.trim();
            const searchRegex = new RegExp(searchTerm, "i");

            allListings = await Listing.find({
                $or: [
                    { title: searchRegex },
                    { location: searchRegex },
                    { country: searchRegex },
                ],
            });
        } else {
            allListings = await Listing.find({});
        }

        res.render("listings/index.ejs", { allListings, q: q || "" });
    }

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params; //extracts data from the URL
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("owner"); //populate means that it replaces the ObjectIds in the reviews and owner fields of the listing with the actual review and user documents from their respective collections
    //populates the reviews and owner fields of the listing with the actual review and user documents instead of just their ObjectIds
    if(!listing) {
        req.flash("error", "Listing not found ☹️");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next) => {
    //let {title, description, image, price, country, location} = req.body; //extracts data sent inside the HTTP request
        let url = req.file.path; //gets the URL of the uploaded image from the request object
        let filename = req.file.filename; //gets the filename of the uploaded image from the request object
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; //sets the owner of the new listing to the currently logged-in user
        newListing.image = {url, filename}; //sets the image field of the new listing to an object containing the URL and filename of the uploaded image
        
        if (req.body.listing.location) {
            const geoResult = await maptilerClient.geocoding.forward(req.body.listing.location, { limit: 1 });
            
            if (geoResult.features && geoResult.features.length > 0) {
                const bestMatch = geoResult.features[0];
                
                // 2. Extracting coordinates [longitude, latitude]
                const [lng, lat] = bestMatch.geometry.coordinates;
                
                // 3. Saving coordinates to listing object
                // MongoDB Schema uses the GeoJSON standard format
                newListing.geometry = {
                    type: "Point",
                    coordinates: [lng, lat]
                };
            }
        }
        
        await newListing.save();
        req.flash("success", "New Listing created 🎉");
        res.redirect("/listings");
    }

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing not found ☹️");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url; //stores the original image of the listing in a variable
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250"); //modifies the original image URL to include transformation parameters for resizing the image to 300x300 pixels
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructs/unpacks req.body.listing (object) to get all the individual parameters of the new data
    
    if(typeof req.file !== "undefined") { //checks if a new image file was uploaded
        let url = req.file.path; 
        let filename = req.file.filename;
        listing.image = {url, filename}; //updates the image field of the listing to an object containing the URL and filename of the uploaded image
        await listing.save();
    }
    
    req.flash("success", "Listing Updated 🎉");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("deleted", "Listing Deleted 💥");
    res.redirect("/listings");
}