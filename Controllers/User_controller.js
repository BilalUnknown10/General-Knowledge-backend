const User = require("../Models/user_model");
const generate_JWT = require("../Utils/generate_JWT");

// Registration Api
const userRegistration = async (req, res) => {
    try {
        const {userName, email, password} = req.body;

        // validation checking field are not empty
        if(!userName) return res.status(400).json("Username are required");
        if(!email) return res.status(400).json("Email are required");
        if(!password) return res.status(400).json("Password are required");

        // checking user already exist
        const checkExistingUser = await User.findOne({email});

        if(checkExistingUser) return res.status(409).json("User already exist with this email");

        // create new user
        const newUser = await User.create({userName, email, password});

        if(!newUser) return res.status(500).json("Internal Server Error");

        // generate jwt token for authentication
        const token = await generate_JWT(newUser._id);

        console.log("jwt from registration : ",token);

        return res.status(201).json({
            message : "User create successfully",
            user : newUser
        });
        
    } catch (error) {
        console.log("error in user registration user controller", error);
    }
};


// Login Api
const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // checking user details in DB
        const loginUser = await User.findOne({email});

        if(!loginUser) return res.status(404).json("Invalid Credentials");

        // checking password is correct or not
        const isMatchPassword = await loginUser.comparePassword(password);
        if(!isMatchPassword) return res.status(400).json("Invalid Credentials");

        return res.status(200).json("User login successfully");

    } catch (error) {
        console.log("error user login api controller : ", error);
    }
}


module.exports = {
    userRegistration,
    userLogin
}