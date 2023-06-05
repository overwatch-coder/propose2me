const jwt = require("jsonwebtoken");
const User = require("../models/users.models");

const authenticateUser = async (req, res, next) => {

    try {
        //access token from cookies and check if it exists
        const authorisation = req.headers?.authorisation;
        if(!authorisation) return res.status(403).json({success: false, message: 'Authorisation headers required!'});

        const token = authorisation.split(" ")[1];
        
        if(!token) return res.status(403).json({success: false, message: 'No token found. Unauthorized access!'});

        // verify token's validity
        const id = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!id) return res.status(400).json({success: false, message: 'You are not authorized!'})

        const user = await User.findOne({_id: id});
        if(!user) res.status(400).json({success: false, message: "User is either not authenticated or doesn't exist"});

        //add user info except password to request headers
        const {password, ...rest} = user._doc;
        req.user = rest;

        //call the next function to execute the next middleware
        next();
    } catch (error) {
        res.status(500).json({success: false, message: 'Forbidden! Token expired or Not authorized!'})
    } 
}

module.exports = {
    authenticateUser
}