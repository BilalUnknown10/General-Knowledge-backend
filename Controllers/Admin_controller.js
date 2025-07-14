const MCQ = require("../Models/MCQS_model");

// upload new mcq
const uploadMCQ = async (req, res) => {
    try {
        const {question, answers, correctAnswer} = req.body;

        // checking if field are not empty
        if(!question) return res.status(400).json("Question filed are required");
        if(!answers) return res.status(400).json("Answers filed are required");
        if(!correctAnswer) return res.status(400).json("Correct answer filed are required");
        console.log(req.user.isAdmin);

        if(!req.user.isAdmin) return res.status(400).json({message : "Your are not admin please contact with admin"});

        // checking if MCQ are not exist
        const checkingMCQ = await MCQ.findOne({correctAnswer : correctAnswer});

        if(checkingMCQ) return res.status(400).json({
            message : "This mcq already exist",
            ExistMCQ : checkingMCQ
        });

        // convert answers to array
        const splitAnswers = answers.split(",");

        // create new mcq
        const newMCQ = await MCQ.create({
            question,
            answers : splitAnswers,
            correctAnswer
        });

        if(!newMCQ) return res.status(500).json({message : "Internal server error"});

        return res.status(200).json({
            message : "MCQ uploaded successfully",
            newMCQ
        })
        
    } catch (error) {
        console.log("error admin controller upload mcq Api : ", error);
    }
};


module.exports = {uploadMCQ}