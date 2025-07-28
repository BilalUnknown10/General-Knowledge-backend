const User = require("../Models/user_model");
const {
  uploadOnCloudinary,
  deleteOnCloudinary,
} = require("../Utils/cloudinary");
const generate_JWT = require("../Utils/generate_JWT");
const MCQ = require("../Models/MCQS_model");
const { sendMail, isEmailValid } = require("../Utils/send_mail");
const { generate4DigitCode } = require("../Utils/generate_code");
let app = null;

// Registration Api
const userRegistration = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // validation checking field are not empty
    if (!userName) return res.status(400).json("Name are required");
    if (!email) return res.status(400).json("Email are required");
    if (!password) return res.status(400).json("Password are required");
    if (
      !email.includes("@") ||
      !email.includes(".com") ||
      !email.includes("gmail")
    ) {
      return res
        .status(400)
        .json({
          field: "invalidGmail",
          message: "Only Gmail addresses are allowed",
        });
    }

    // checking user already exist
    const checkExistingUser = await User.findOne({ email });

    if (checkExistingUser)
      return res.status(409).json({field : "existUser", message : "User exist with this email please login"});

    // create new user
    const newUser = await User.create({ userName, email, password });

    if (!newUser) return res.status(500).json("Internal Server Error");

    // generate jwt token for authentication
    const token = await generate_JWT(newUser._id);

    const mailOptions = {
      from: '"General Knowledge"',
      to: email,
      subject: "Welcome! Your Account Has Been Successfully Created",
      html: `
                <h2>Welcome to General Knowledge 🎉</h2>
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Your account has been successfully created.</p>
                <p>You can now <a href="https://your-app-url.com/login">log in</a> and start using our services.</p>
                <br>
                <p>If you have any questions, just reply to this email — we're happy to help.</p>
                <br>
                <p>Cheers,<br>The General Knowledge Team</p>
            `,
    };

    sendMail(mailOptions);

    return res.status(201).json({
      message: "User create successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.log("error in user registration user controller", error);
  }
};

// Login Api
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking user details in DB
    const loginUser = await User.findOne({ email });

    if (!loginUser) return res.status(404).json("Invalid Credentials");

    // checking password is correct or not
    const isMatchPassword = await loginUser.comparePassword(password);
    if (!isMatchPassword) return res.status(400).json("Invalid Credentials");

    const token = await generate_JWT(loginUser._id);

    return res
      .status(200)
      .json({ message: "User login successfully", token: token });
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
    if (!file) return res.status(400).json("Field are required");

    // Find old user profile image if exist and delete from cloudinary
    const oldProfileImage = await User.findById(req.user._id);
    const oldProfileImageURL = oldProfileImage?.publicId;
    const deleteOldProfileImage = await deleteOnCloudinary(oldProfileImageURL);

    // Update new profile image to cloudinary
    const cloudinaryFilePath = await uploadOnCloudinary(req.file?.path);
    const profileImageURL = cloudinaryFilePath?.url;
    const publicId = cloudinaryFilePath?.public_id;

    // save new profile image cloudinary url in database
    const updateProfileImage = await User.findByIdAndUpdate(
      req.user._id,
      {
        userProfileImage: profileImageURL,
        publicId: publicId,
      },
      { new: true }
    );

    return res.status(200).json("Profile image uploaded successfully");
  } catch (error) {
    console.log("error in editUserProfileImage : ", error);
  }
};

// User submit answers Api
const userSubmitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { submitAnswer } = req.body;

    // checking if fields are not empty
    if (!id) return res.status(400).json({ message: "Id are required" });
    if (!submitAnswer)
      return res
        .status(400)
        .json({ message: "Please select one of the following" });

    const submit = {
      answer: submitAnswer,
      status: false,
    };

    // getting Mcq model
    const getMcqDocument = await MCQ.findById({ _id: id });

    if (!getMcqDocument)
      return res.status(500).json({ message: "Internal server error" });

    // checking user answer are true are not
    if (submitAnswer === getMcqDocument.correctAnswer) {
      submit.status = true;
    }

    // save submitted answer in user model
    const saveAnswer = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { submittedAnswers: submit },
      },
      { new: true }
    );

    if (!saveAnswer)
      return res.status(500).json({ message: "Internal server error" });

    return res
      .status(200)
      .json({ message: "Your answer submitted successfully", saveAnswer });
  } catch (error) {
    console.log("error in user submit answer Api in user controller : ", error);
  }
};

// User email verification Api
const userVerificationOTP = async (req, res) => {
  try {
    const generatedCode = await generate4DigitCode();
    app = generatedCode;

    const email = req.user.email;

    const mailOptions = {
      from: `"General Knowledge"`,
      to: email,
      subject: "Your Verification Code",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Use the 4-digit verification code below to verify your email:</p>
        <h1 style="color: #2e6da4;">${generatedCode}</h1>
        <p>This code will expire in 10 minutes.</p>
        <br>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>Thanks,<br>General Knowledge Security Team</p>
      </div>
    `,
    };

    isEmailValid(mailOptions);

    return res.status(200).json({
      message: `verification code has been sent to ${req.user.email}`,
    });
  } catch (error) {
    console.log(
      "error in user verification code api in use controller : ",
      error
    );
  }
};

const userEmailVerification = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    if (!verificationCode)
      return rs.status(400).json({ message: "Please Enter verification code" });
    if (verificationCode !== app)
      return res.status(400).json({ message: "Invalid code" });

    console.log(req.user);

    const emailVerified = await User.findByIdAndUpdate(
      req.user._id,
      {
        isEmailVerified: true,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Email successfully verified : ", emailVerified });
  } catch (error) {
    console.log(
      "error in user email verification api use controller : ",
      error
    );
  }
};

module.exports = {
  userRegistration,
  userLogin,
  userLogout,
  editUserProfileImage,
  userSubmitAnswer,
  userVerificationOTP,
  userEmailVerification,
};
