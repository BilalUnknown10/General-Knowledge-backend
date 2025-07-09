const User = require("../Models/user_model");

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

        return res.status(201).json({
            message : "User create successfully",
            user : newUser
        });
        
    } catch (error) {
        console.log("error in user registration user controller", error);
    }
};




module.exports = {userRegistration}