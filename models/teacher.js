const mongoose = require('mongoose');
const TeacherSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    teacherID: {
        type: String,
        required: true
    },


    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }, 

    gender: {
        type: String,
        required: true
    }
});

let Teacher = module.exports = mongoose.model('Teacher', TeacherSchema);