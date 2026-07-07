const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({}); //clearing random data
    initData.data = initData.data.map((obj) => ({...obj, owner: "6a4ad5018d6138787da0afe7"})); //adding owner to each listing
    await Listing.insertMany(initData.data); //data required from data.js
    console.log("data was initialized");
};

initDB();