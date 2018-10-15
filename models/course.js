const mongoose = require('mongoose');
const CourseSchema = mongoose.Schema({
    courses: {
        type: [String],
        required: true
    },
    name: {
        type: String,
        default: 'course'
    }
});

let Course = module.exports = mongoose.model('Course', CourseSchema);