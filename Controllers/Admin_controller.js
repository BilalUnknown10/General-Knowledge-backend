const MCQ = require("../Models/MCQS_model");
const User = require("../Models/user_model");
const Feedback = require("../Models/Feedback_model");
const Answers = require("../Models/Answers_model");
const { sendMail } = require("../Utils/send_mail");

// upload new mcq
const uploadMCQ = async (req, res) => {
  try {
    const { question, answers, correctAnswer } = req.body;

    // checking if field are not empty
    if (!question) return res.status(400).json("Question filed are required");
    if (!answers) return res.status(400).json("Answers filed are required");
    if (!correctAnswer)
      return res.status(400).json("Correct answer filed are required");

    if (!req.user.isAdmin)
      return res
        .status(400)
        .json({ message: "Your are not admin please contact with admin" });

    // checking if MCQ are not exist
    const checkingMCQ = await MCQ.findOne({ correctAnswer: correctAnswer });

    if (checkingMCQ)
      return res.status(400).json({
        message: "This mcq already exist",
        ExistMCQ: checkingMCQ,
      });

    // convert answers to array
    const splitAnswers = answers.split(",");

    // create new mcq
    const newMCQ = await MCQ.create({
      question,
      answers: splitAnswers,
      correctAnswer,
    });

    if (!newMCQ)
      return res.status(500).json({ message: "Internal server error" });

    return res.status(200).json({
      message: "MCQ uploaded successfully",
      newMCQ,
    });
  } catch (error) {
    console.log("error admin controller upload mcq Api : ", error);
  }
};

// Get one document by id
const getOneMCQ = async (req, res) => {
  try {
    const { MCQId } = req.params;

    if (!req.user.isAdmin)
      return res
        .status(400)
        .json({ message: "Your are not admin please contact with admin" });
    if (!MCQId)
      return res
        .status(400)
        .json({ message: "Id are missing or Id are required" });

    const getOneMCQ = await MCQ.findById({ _id: MCQId });
    if (!getOneMCQ)
      return res.status(500).json({ message: "Internal Server Error" });

    return res
      .status(200)
      .json({ message: "successfully MCQ find", getOneMCQ });
  } catch (error) {
    console.log("error in edit mcq in admin controller : ", error);
  }
};

// Edit MCQ Api
const editMCQ = async (req, res) => {
  try {
    const { MCQId } = req.params;
    const { question, answers, correctAnswer } = req.body;

    if (!req.user.isAdmin)
      return res
        .status(400)
        .json({ message: "Your are not admin please contact with admin" });
    if (!MCQId) return res.status.json({ message: "Id are required" });

    let splitAnswers;
    if (answers) {
      splitAnswers = answers.split(",");
    }

    const editMCQ = await MCQ.findByIdAndUpdate(
      { _id: MCQId },
      {
        $set: {
          question,
          answers: splitAnswers,
          correctAnswer,
        },
      },
      { new: true }
    );

    if (!editMCQ)
      return res.status(500).json({ message: "Internal server error" });

    return res
      .status(200)
      .json({ message: "Data updated successfully", editMCQ });
  } catch (error) {
    console.log("error in admin controller edit mcq api : ", error);
  }
};

// Delete MCQ Api
const deleteMCQ = async (req, res) => {
  try {
    const { MCQId } = req.params;
    if (!req.user.isAdmin)
      return res
        .status(400)
        .json({ message: "Your are not admin please contact with admin" });
    if (!MCQId) return res.status(400).json({ message: "Id are not found" });

    const deleteMCQ = await MCQ.findByIdAndDelete({ _id: MCQId });
    if (!deleteMCQ)
      return res.status(500).json({ message: "Internal server error" });

    return res.status(200).json({ message: "MCQ Deleted Successfully" });
  } catch (error) {
    console.log("error in admin controller delete mcq api : ", error);
  }
};

// Get all Mcq's
const getAllMCQS = async (req, res) => {
  try {
    const getAllMCQS = await MCQ.find();
    if (!getAllMCQS) return res.status(300).json({ message: "No MCQS Found" });
    return res.status(200).json({ getAllMCQS });
  } catch (error) {
    console.log("Error in getting all mcq's : ", error);
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const getAllUsers = await User.find().select("-password");
    if (!getAllUsers)
      return res.status(300).json({ message: "No Users Found" });
    return res.status(200).json({ getAllUsers });
  } catch (error) {
    console.log("Error in getting all users : ", error);
  }
};

// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const getAllFeedbacks = await Feedback.find();
    if (!getAllFeedbacks)
      return res.status(300).json({ message: "No Feedbacks Found" });

    return res.status(200).json(getAllFeedbacks);
  } catch (error) {
    console.log("Error in get all feedbacks : ", error);
  }
};

// Delete all Mcq's
const deleteAllMCQS = async (req, res) => {
  try {
    const deleteAll_MCQS = await MCQ.deleteMany({});
    return res.status(200).json({ message: "All MCQ'S Deleted Successfully" });
  } catch (error) {
    console.log("Error in dele all mcqs : ", error);
  }
};

// Delete all answers
const deleteAllAnswers = async (req, res) => {
  try {
    const deleteAll_Answers = await Answers.deleteMany({});
    return res
      .status(200)
      .json({ message: "All Answers Deleted Successfully" });
  } catch (error) {
    console.log("Error in dele all answers : ", error);
  }
};

// Delete user by id
const deleteUserById = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) return res.status(500).json({ message: "Internal Server Error" });

    // check use exist
    const checkUser = await User.findByIdAndDelete({ _id });
    if (!checkUser) return res.status(400).json({ message: "User Not Found" });

    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log("Error in delete user by id : ", error);
  }
};

// Delete feedback by id
const deleteFeedbackById = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) return res.status(500).json({ message: "Internal Server Error" });

    const deleteFeedback = await Feedback.findByIdAndDelete({ _id });
    if (!deleteFeedback)
      res.status(404).json({ message: "Feedback Not Found" });

    return res.status(200).json({ message: "Feedback Deleted Successfully" });
  } catch (error) {
    console.log("Error in delete feedback by id : ", error);
  }
};

// Delete all feedbacks
const deleteAllFeedbacks = async (req, res) => {
  try {
    const deleteAll = await Feedback.deleteMany({});
    return res
      .status(200)
      .json({ message: "All Feedbacks Deleted Successfully" });
  } catch (error) {
    console.log("Error in delete all feedbacks : ", error);
  }
};

// Send email to all users
const sendEmailToAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    let timeStatus;

    const date = new Date();
    const getHours = date.getHours();

    if (getHours < 12) {
      timeStatus = "Good Morning";
    } else if (getHours >= 12 && getHours < 18) {
      timeStatus = "Good Evening";
    } else {
      timeStatus = "Good Night";
    }

    for (const user of allUsers) {
      const mailOptions = {
        to: user.email,
        subject: "📝 New MCQs Have Been Added!",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi <strong>${user.userName}</strong>, ${timeStatus} 🌟</p>
        <p>Great news! 🎉 We’ve just added <strong>new Multiple Choice Questions (MCQs)</strong> to the General Knowledge platform.</p>
        <p>Stay sharp and test your knowledge by checking them out.</p>
        <br>
        <a href="https://general-knowledge-wine.vercel.app"
           style="background-color:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
          👉 Try New MCQs
        </a>
        <br><br>
        <p>If you have any questions, just reply to this email — we’re always happy to help.</p>
        <br>
        <p>Cheers,<br>The General Knowledge Team</p>
      </div>
    `,
      };

      await sendMail(mailOptions);
    }
    
    res.status(200).json({ message: "✅ Emails sent successfully" });
  } catch (error) {
    console.error("❌ Error in send email to all users:", error);
    res.status(500).json({ message: "Error sending emails" });
  }
};

module.exports = {
  uploadMCQ,
  getOneMCQ,
  editMCQ,
  deleteMCQ,
  getAllMCQS,
  getAllUsers,
  getAllFeedbacks,
  deleteAllAnswers,
  deleteAllMCQS,
  deleteUserById,
  deleteFeedbackById,
  deleteAllFeedbacks,
  sendEmailToAllUsers,
};
