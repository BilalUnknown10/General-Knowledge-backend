const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    answer : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default : false
    },

    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    }
});

const Answers = mongoose.model("Answers", answersSchema);

module.exports = Answers;