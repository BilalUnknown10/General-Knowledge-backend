const MCQ = require("../Models/MCQS_model");

// upload new mcq
const uploadMCQ = async (req, res) => {
    try {
        const {question, answers, correctAnswer} = req.body;

        // checking if field are not empty
        if(!question) return res.status(400).json("Question filed are required");
        if(!answers) return res.status(400).json("Answers filed are required");
        if(!correctAnswer) return res.status(400).json("Correct answer filed are required");

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

// Get one document by id
const getOneMCQ = async (req, res) => {
    try {
        const {MCQId} = req.params;

        if(!req.user.isAdmin) return res.status(400).json({message : "Your are not admin please contact with admin"});
        if(!MCQId) return res.status(400).json({message : "Id are missing or Id are required"});

        const getOneMCQ = await MCQ.findById({_id : MCQId});
        if(!getOneMCQ) return res.status(500).json({message : "Internal Server Error"});

        return res.status(200).json({message : "successfully MCQ find", getOneMCQ});
    } catch (error) {
        console.log("error in edit mcq in admin controller : ", error)
    }
};

// Edit MCQ Api
const editMCQ = async (req, res) => {
    try {
        const {MCQId} = req.params;
        const {question, answers, correctAnswer} = req.body;

        if(!req.user.isAdmin) return res.status(400).json({message : "Your are not admin please contact with admin"});
        if(!MCQId) return res.status.json({message : "Id are required"});

        let splitAnswers;
        if(answers) {
             splitAnswers = answers.split(",");
        }

        const editMCQ = await MCQ.findByIdAndUpdate({_id : MCQId},{
            $set : {
                question,
                answers : splitAnswers,
                correctAnswer
            }
        }, {new : true});

        if(!editMCQ) return res.status(500).json({message : "Internal server error"});

        return res.status(200).json({message : "Data updated successfully", editMCQ});
    } catch (error) {
        console.log("error in admin controller edit mcq api : ", error);
    };
};

// Delete MCQ Api
const deleteMCQ = async (req, res) => {
    try {
        const {MCQId} = req.params;
        if(!req.user.isAdmin) return res.status(400).json({message : "Your are not admin please contact with admin"});
        if(!MCQId) return res.status(400).json({message : "Id are not found"});

        const deleteMCQ = await MCQ.findByIdAndDelete({_id : MCQId});
        if(!deleteMCQ) return res.status(500).json({message : "Internal server error"});

        return res.status(200).json({message : "MCQ Deleted Successfully"});
    } catch (error) {
        console.log("error in admin controller delete mcq api : ", error);
    };
};


module.exports = {
    uploadMCQ,
    getOneMCQ,
    editMCQ,
    deleteMCQ
}