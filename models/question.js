const mongoose = require('mongoose');
const QuestionSchema = mongoose.Schema({
    questionAsked: {
        type: String,
        required: true
    },

    answered: {
        type: Boolean,
        default: false
    },

    askedBy: {
        type: String,
        required: true
    }
});

let Question = module.exports = mongoose.model('Question', QuestionSchema);