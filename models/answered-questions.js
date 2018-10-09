const mongoose = require('mongoose');
const AnsweredQuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        default: false
    },

    askedBy: {
        type: String,
        required: true
    },

    answeredBy: {
        type: String,
        required: true
    }
});

let AnsweredQuestion = module.exports = mongoose.model('AnsweredQuestion', AnsweredQuestionSchema);