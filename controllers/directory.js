const User = require('../models/user');
const Course = require('../models/course');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../cloudinary');
const { sendAccountApprovalEmail } = require('../utils/mailer');

module.exports.renderDirectory = async (req, res) => {
    const pageData = { css: 'directory', js: 'directory', page: 'directory' };
    const { search, course, graduationYear } = req.query;
    const query = { role: 'alumni' };
    if (req.user.role !== 'admin') {
        query.status = 'approved';
        query.profileVisibility = 'public';
    }
    // Search by name, course, or graduation year
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        const matchingCourses = await Course.find({
            courseCode: searchRegex
        }).select('_id');
        const matchingYears = Number(search);
        query.$or = [
            { fullName: searchRegex },
            { course: { $in: matchingCourses.map(c => c._id) } }
        ];

        if (!isNaN(matchingYears)) {
            query.$or.push({ graduationYear: matchingYears });
        }
    }
    // Course dropdown
    if (course) {
        const selectedCourse = await Course.findOne({
            courseCode: course
        });

        if (selectedCourse) {
            query.course = selectedCourse._id;
        }
    }
    // Graduation year dropdown
    if (graduationYear) {
        query.graduationYear = Number(graduationYear);
    }
    const alumni = await User.find(query).populate('course');
    const courses = await Course.find({});
    const graduationYears = await User.distinct('graduationYear', {
        role: 'alumni',
        profileVisibility: 'public'
    });
    graduationYears.sort((a, b) => b - a);
    res.render('alumni/directory', {
        ...pageData,
        alumni,
        courses,
        graduationYears,
        search,
        selectedCourse: course,
        selectedYear: graduationYear
    });
};

module.exports.updateUserStatus = async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        throw new ExpressError('Invalid status', 400);
    }

    if (status === 'rejected') {
        const user = await User.findById(req.params.id);
        if (user && user.profileImage && user.profileImage.filename && user.profileImage.filename !== 'defaul-prof_ryln3w') {
            await cloudinary.uploader.destroy(user.profileImage.filename);
        }
        await User.findByIdAndDelete(req.params.id);
    } else {
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });

        // Send approval email notification if status was changed to approved
        if (status === 'approved' && user && user.email) {
            try {
                await sendAccountApprovalEmail(user.email, user.fullName);
            } catch (emailErr) {
                console.error('Error sending account approval email:', emailErr);
            }
        }
    }

    res.redirect('/alumni/directory');
};

module.exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user && user.profileImage && user.profileImage.filename && user.profileImage.filename !== 'defaul-prof_ryln3w') {
        await cloudinary.uploader.destroy(user.profileImage.filename);
    }
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/alumni/directory');
};
