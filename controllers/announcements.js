const Announcement = require('../models/announcement');

module.exports.renderAnnouncements = async (req, res) => {
    const announcements = await Announcement.find({}).populate('createdBy').sort({ createdAt: -1 });
    const pageData = { css: 'announcements', js: 'announcements', page: 'announcements' };
    res.render('alumni/announcements', {
        ...pageData,
        announcements
    });
};

module.exports.createAnnouncement = async (req, res) => {
    const { title, content } = req.body;
    const announcement = new Announcement({
        title,
        content,
        createdBy: req.user._id
    });
    await announcement.save();
    res.redirect('/alumni/announcement');
};

module.exports.updateAnnouncement = async (req, res) => {
    const { title, content } = req.body;
    await Announcement.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect('/alumni/announcement');
};

module.exports.deleteAnnouncement = async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id);
    res.redirect('/alumni/announcement');
};
