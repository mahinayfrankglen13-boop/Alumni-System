const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    courseName: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);