const Course = require('../models/course');

module.exports.renderCourses = async (req, res) => {
    const courses = await Course.find({});
    const pageData = { css: 'directory', js: 'courses', page: 'courses' };
    res.render('admin/courses', {
        ...pageData,
        courses
    });
};

module.exports.createCourse = async (req, res) => {
    const { courseCode, courseName } = req.body;
    const course = new Course({ courseCode, courseName });
    await course.save();
    res.redirect('/alumni/courses');
};

module.exports.updateCourse = async (req, res) => {
    const { courseCode, courseName } = req.body;
    await Course.findByIdAndUpdate(req.params.id, { courseCode, courseName });
    res.redirect('/alumni/courses');
};

module.exports.deleteCourse = async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect('/alumni/courses');
};
