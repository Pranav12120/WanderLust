const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});
//we don't need to define username and password fields in the schema because passport-local-mongoose will add them automatically.   
//it will add a username,hash and salt feilds to store the username and password hash and salt value. 

userSchema.plugin(passportLocalMongoose); //adds username and password fields to the userSchema and also adds some methods to the schema for authentication
///we are using pbkdf2 algorithm to hash the password and store it in the database. It also adds some methods to the schema for authentication like register, authenticate, serializeUser, deserializeUser etc.

module.exports = mongoose.model("User", userSchema); //User is the name of the model, userSchema is the schema we defined above.