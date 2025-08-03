const mongoose = require('mongoose');

    const MCQSchema = new mongoose.Schema({
        question : {
            type : String,
            required : true
        },

        answers : {
            type : [String],
            required : true
        },
        
        correctAnswer : {
            type : String,
            required : true,
            unique : true
        }
    });

const MCQ = mongoose.model("MCQ", MCQSchema);

module.exports = MCQ;