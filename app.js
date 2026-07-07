if(process.env.NODE_ENV != "production") {
    require('dotenv').config(); //dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //ejs-mate is used to add template layout, partial, and block functionality to the EJS (Embedded JavaScript) templating engine
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default; //connect-mongo is a MongoDB session store for Express and Connect. It allows you to store session data in a MongoDB database, which can be useful for scaling applications and persisting session data across server restarts.
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended: true})); //to parse the url encoded data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60, //time in seconds after which the session will be updated in the database
});

store.on("error", () => {
    console.log("ERROR in Mongo Session Store", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, //cookie will expire in 7 days
        maxAge: 7*24*60*60*1000, //cookie will expire in 7 days
        httpOnly: true, //cookie cannot be accessed by client side scripts
    },
};

// app.get("/",(req,res) => {
//     res.send("This is root path");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //a web application needs the ability to identify users as they browse from page to page. This is done by creating a session for each user and storing their information in a cookie. 
//The passport.session() middleware is responsible for managing the user's session and ensuring that they remain authenticated as they navigate through the application.
passport.use(new LocalStrategy(User.authenticate())); //User.authenticate() is a method provided by the passport-local-mongoose package that is used to authenticate users based on their username and password.
// It is used in conjunction with the local strategy to handle user authentication in a Node.js application.

passport.serializeUser(User.serializeUser()); //storing user data(information) in the session is done by serializing the user object into a unique identifier (usually the user's ID) and storing it in the session. 
passport.deserializeUser(User.deserializeUser()); //after the session is over,removing the user data from the session is done by deserializing the unique identifier stored in the session back into the original user object.

app.use((req,res,next) => {
    res.locals.success = req.flash("success"); //this line of code is used to set a local variable called success in the response object (res.locals) with the value of the flash message stored under the key "success". This allows the success message to be accessed and displayed in the views rendered by the application.
    res.locals.error = req.flash("error"); //this line of code is used to set a local variable called error in the response object (res.locals) with the value of the flash message stored under the key "error". This allows the error message to be accessed and displayed in the views rendered by the application.
    res.locals.deleted = req.flash("deleted"); 
    res.locals.currUser = req.user; //this line of code is used to set a local variable called currUser in the response object (res.locals) with the value of the currently authenticated user (req.user). This allows the current user's information to be accessed and displayed in the views rendered by the application.
    next();
});

// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email: "fake@example.com",
//         username: "fakeUser"
//     });

//     let registeredUser = await User.register(fakeUser, "hello123"); //User.register() is a method provided by the passport-local-mongoose package that is used to register a new user in the database. It takes two arguments: the user object (fakeUser) and the password ("hello123"). The method hashes the password and stores it securely in the database along with the user information.
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter); //all the routes defined in listings.js will be prefixed with /listings
app.use("/listings/:id/reviews", reviewRouter); //Parent route
app.use("/", userRouter); 

app.all(/.*/, (req,res,next) => { //all routes that are not defined will be handled by this middleware function
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => { //validation error handling middleware
    let {statusCode = 500, message = "Something went wrong!  "} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});


