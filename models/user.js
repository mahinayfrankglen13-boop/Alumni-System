const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    alumniId: {
        type: Number,
        required: true,
        unique: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['alumni', 'admin'],
        default: 'alumni'
    },
    bio: {
        type: String,
        trim: true,
        default: 'No bio provided.'
    },
    profileVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    profileImage: {
        url: {
            type: String,
            default: 'https://res.cloudinary.com/fad0iwxm/image/upload/v1786894165/defaul-prof_ryln3w.jpg'
        },
        filename: {
            type: String,
            default: 'defaul-prof_ryln3w'
        }
    },
    resetPasswordCode: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', UserSchema);