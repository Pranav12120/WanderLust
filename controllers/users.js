const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust! 🎉");
            res.redirect("/listings");
        })
    } catch(e) {
        req.flash("error", `${e.message} 🥺`);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => { //passport.authenticate() is a middleware provided by the passport package that is used to authenticate users based on their username and password. It takes two arguments: the strategy to be used for authentication (in this case, the local strategy) and an options object that can be used to customize the behavior of the middleware.
    req.flash("success", "welcome back to Wanderlust! You are logged in successfully 🎉");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // If the redirectUrl is not set in res.locals, it will default to "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are Logged out👋");
        res.redirect("/listings");
    })
}