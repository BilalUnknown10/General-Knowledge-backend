const User = require("../Models/user_model");
const { uploadOnCloudinary } = require("../Utils/cloudinary");
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
            user : newUser,
            token : token
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

        const token = await generate_JWT(loginUser._id);

        return res.status(200).json({message : "User login successfully", token : token});

    } catch (error) {
        console.log("error user login api controller : ", error);
    }
};

// Logout Api
const userLogout = async (req, res) => {
    return res.status(200).json("Logout successfully");
};

// Edit user profile image
const editUserProfileImage = async (req, res) => {
   try {
    const file = req.file;
    if(!file) return res.status(400).json("Field are required");

    const cloudinaryFilePath = await uploadOnCloudinary(req.file?.path);
    const profileImageURL = cloudinaryFilePath?.url;

    const updateProfileImage = await User.findByIdAndUpdate(req.user._id,{
        userProfileImage : profileImageURL
    },{new : true});
    
    return res.status(200).json("Profile image uploaded successfully");
    
   } catch (error) {
    console.log("error in editUserProfileImage : ", error);
   }
}


module.exports = {
    userRegistration,
    userLogin,
    userLogout,
    editUserProfileImage
}