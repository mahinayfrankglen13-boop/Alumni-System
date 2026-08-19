const User = require('../models/user');
const Job = require('../models/job');
const Announcement = require('../models/announcement');
const Course = require('../models/course');
const { cloudinary } = require('../cloudinary');

module.exports.renderDashboard = async (req, res) => {
    const alumniCount = await User.countDocuments({
        role: 'alumni',
        profileVisibility: 'public'
    });

    const jobCount = await Job.countDocuments({ status: 'approved' });
    const announcementCount = await Announcement.countDocuments({});
    const courses = await Course.find({});
    const announcements = await Announcement.find({})
        .sort({ createdAt: -1 })
        .limit(2);
    const jobs = await Job.find({ status: 'approved' })
        .populate('postedBy')
        .sort({ createdAt: -1 })
        .limit(3);

    const pageData = { css: 'dashboard', js: 'dashboard', page: 'home' };
    res.render('alumni/dashboard', {
        ...pageData,
        alumniCount,
        jobCount,
        announcementCount,
        courses,
        announcements,
        jobs,
        currentUser: req.user
    });
};

module.exports.renderProfile = async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate('course');
    const pageData = { css: 'profile', js: 'profile', page: 'profile' };
    res.render('alumni/profile', {
        ...pageData,
        currentUser
    });
};

module.exports.updateProfile = async (req, res) => {
    const { fullName, email, graduationYear, bio, profileVisibility } = req.body;
    const user = await User.findById(req.user._id);
    user.fullName = fullName;
    user.email = email;
    user.graduationYear = graduationYear;
    user.bio = bio || 'No bio provided.';
    if (profileVisibility && ['public', 'private'].includes(profileVisibility)) {
        user.profileVisibility = profileVisibility;
    }

    if (req.file) {
        // Automatically delete previous custom photo from Cloudinary (except default image)
        if (user.profileImage && user.profileImage.filename && user.profileImage.filename !== 'defaul-prof_ryln3w') {
            await cloudinary.uploader.destroy(user.profileImage.filename);
        }
        user.profileImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await user.save();
    res.redirect('/alumni/profile');
};

module.exports.updatePrivacy = async (req, res) => {
    const { profileVisibility } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
        profileVisibility
    });
    res.json({ success: true });
};