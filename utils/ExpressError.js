class ExpressError extends Error { 
    constructor(statusCode, message) {
        super(); //calls the constructor of the parent class (Error) to initialize the error object with the provided message. This allows the ExpressError class to inherit properties and methods from the built-in Error class.
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;