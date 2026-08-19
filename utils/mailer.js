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

module.exports = { sendResetCodeEmail };
