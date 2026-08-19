if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : '';

    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
        transporter = nodemailer.createTransport({
            pool: true,
            maxConnections: 5,
            host: process.env.EMAIL_HOST.trim(),
            port: parseInt(process.env.EMAIL_PORT.trim()),
            secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE.trim() === 'true' : false,
            auth: { user, pass }
        });
    } else {
        transporter = nodemailer.createTransport({
            pool: true,
            maxConnections: 5,
            service: process.env.EMAIL_SERVICE ? process.env.EMAIL_SERVICE.trim() : 'gmail',
            auth: { user, pass }
        });
    }

    return transporter;
};

const sendResetCodeEmail = async (toEmail, code) => {
    const activeTransporter = getTransporter();
    const userEmail = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
    const fromAddress = userEmail
        ? `"MSU-MCEST Alumni System" <${userEmail}>`
        : '"MSU-MCEST Alumni System" <no-reply@mcest.edu.ph>';

    const mailOptions = {
        from: fromAddress,
        to: toEmail,
        subject: 'Password Reset Verification Code - MSU-MCEST Alumni',
        text: `Hello,\n\nYou requested to reset your password. Your 6-digit verification code is:\n\n${code}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nMSU-MCEST Alumni Portal Team`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #6b1728; margin-top: 0; font-family: Georgia, serif;">MSU-MCEST Alumni Portal</h2>
                <p style="color: #333333; font-size: 15px;">Hello,</p>
                <p style="color: #333333; font-size: 15px;">You requested to reset your password. Here is your 6-digit verification code:</p>
                <div style="background-color: #f8e9ed; padding: 16px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #6b1728; border-radius: 8px; margin: 20px 0; border: 1px solid #f2c6d0;">
                    ${code}
                </div>
                <p style="color: #666666; font-size: 14px;">This code is valid for <strong>15 minutes</strong>.</p>
                <p style="color: #666666; font-size: 14px;">If you did not request a password reset, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999999; text-align: center; margin-bottom: 0;">MSU-MCEST Alumni Association System</p>
            </div>
        `
    };

    return await activeTransporter.sendMail(mailOptions);
};

const sendAccountApprovalEmail = async (toEmail, fullName) => {
    const activeTransporter = getTransporter();
    const userEmail = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
    const fromAddress = userEmail
        ? `"MSU-MCEST Alumni System" <${userEmail}>`
        : '"MSU-MCEST Alumni System" <no-reply@mcest.edu.ph>';

    const mailOptions = {
        from: fromAddress,
        to: toEmail,
        subject: 'Account Approved! Welcome to the MSU-MCEST Alumni Portal',
        text: `Hello ${fullName || 'Alumnus'},\n\nGreat news! Your account registration for the MSU-MCEST Alumni Portal has been approved by the administrator.\n\nYou can now log in to access the alumni directory, career opportunities, campus announcements, and connect with fellow graduates.\n\nLog in here: https://alumni-system-5c4e.onrender.com/login\n\nBest regards,\nMSU-MCEST Alumni Portal Team`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #6b1728; margin: 0; font-family: Georgia, serif; font-size: 22px;">MSU-MCEST Alumni Portal</h2>
                    <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Mindanao State University - MCEST</p>
                </div>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 28px; margin-bottom: 4px;">🎉</div>
                    <h3 style="color: #166534; margin: 0; font-size: 18px; font-weight: 700;">Account Approved!</h3>
                </div>
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello <strong>${fullName || 'Alumnus'}</strong>,</p>
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Great news! Your registration request has been reviewed and <strong style="color: #16a34a;">approved</strong> by the alumni administrator.</p>
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">You now have full access to:</p>
                <ul style="color: #475569; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                    <li><strong>Alumni Directory</strong> — Find and network with fellow graduates</li>
                    <li><strong>Career Opportunities</strong> — Discover and post job openings</li>
                    <li><strong>Campus Announcements</strong> — Stay updated on university news & reunions</li>
                    <li><strong>Alumni Profile</strong> — Manage your public/private alumni presence</li>
                </ul>
                <div style="text-align: center; margin: 28px 0;">
                    <a href="https://alumni-system-5c4e.onrender.com/login" style="background-color: #6b1728; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
                        Log In to Portal →
                    </a>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.5;">You can sign in using your registered email address and password.</p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px 0;">
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">MSU-MCEST Alumni Association Tracking & Profiling System</p>
            </div>
        `
    };

    return await activeTransporter.sendMail(mailOptions);
};

module.exports = { sendResetCodeEmail, sendAccountApprovalEmail };

