const Job = require('../models/job');
const ExpressError = require('../utils/ExpressError');

module.exports.renderJobs = async (req, res) => {
    const pageData = { page: 'jobs', css: 'jobs', js: 'jobs' };
    let query = {};
    if (req.user.role !== 'admin') {
        query = {
            $or: [
                { status: 'approved' },
                { postedBy: req.user._id }
            ]
        };
    }
    const jobs = await Job.find(query)
        .populate({ path: 'postedBy', populate: { path: 'course' } })
        .sort({ createdAt: -1 });
    res.render('alumni/job', { ...pageData, jobs });
};

module.exports.createJob = async (req, res) => {
    const { title, company, description, location, applicationUrl } = req.body;
    const job = new Job({ title, company, description, location, applicationUrl, postedBy: req.user._id, status: 'pending' });
    await job.save();
    res.redirect('/alumni/jobs');
};

module.exports.updateJobStatus = async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        throw new ExpressError('Invalid status', 400);
    }
    if (status === 'rejected') {
        await Job.findByIdAndDelete(req.params.id);
    } else {
        await Job.findByIdAndUpdate(req.params.id, { status });
    }
    res.redirect('/alumni/jobs');
};

module.exports.updateJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        throw new ExpressError('Job not found', 404);
    }
    if (!job.postedBy.equals(req.user._id)) {
        throw new ExpressError('Forbidden', 403);
    }
    const { title, company, description, location, applicationUrl } = req.body;
    job.title = title;
    job.company = company;
    job.description = description;
    job.location = location;
    job.applicationUrl = applicationUrl;
    await job.save();
    res.redirect('/alumni/jobs');
};

module.exports.deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        throw new ExpressError('Job not found', 404);
    }
    if (req.user.role !== 'admin' && !job.postedBy.equals(req.user._id)) {
        throw new ExpressError('Forbidden', 403);
    }
    await Job.findByIdAndDelete(req.params.id);
    res.redirect('/alumni/jobs');
};
