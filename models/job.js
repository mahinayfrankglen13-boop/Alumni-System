const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    company: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        trim: true
    },

    applicationUrl: {
        type: String,
        required: true,
        trim: true
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);