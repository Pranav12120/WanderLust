module.exports = (fn) => { //this is a higher order function that takes in an async function (fn) as a parameter and returns a middleware function that handles any errors that may occur during the execution of the async function.
    return (req,res,next) => { //this is a middleware function that takes in the request, response and next function as parameters and executes the async function (fn) passed to it.
        fn(req,res,next).catch(next); //if any error occurs, it will be passed to the next middleware (error handling middleware)
    }
}