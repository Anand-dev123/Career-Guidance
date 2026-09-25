const nodemailer = require("nodemailer");

// ==========================================
// Email Transporter
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// ==========================================
// Send Password Reset Email
// ==========================================

const sendPasswordResetEmail = async (
    email,
    resetUrl
) => {

    const mailOptions = {
        from: `"CareerGuide" <${process.env.EMAIL_USER}>`,

        to: email,

        subject:
            "CareerGuide - Password Reset",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                color: #0F172A;
                background: #F8FAFC;
            ">

                <div style="
                    background: #0F172A;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                    color: white;
                ">
                    <h2 style="margin: 0;">
                        CareerGuide
                    </h2>
                </div>

                <div style="
                    background: white;
                    padding: 30px;
                    border: 1px solid #E2E8F0;
                ">

                    <h2>
                        Reset Your Password
                    </h2>

                    <p>
                        We received a request to reset
                        your CareerGuide account password.
                    </p>

                    <p>
                        Click the button below to create
                        a new password.
                    </p>

                    <div style="
                        text-align: center;
                        margin: 30px 0;
                    ">

                        <a
                            href="${resetUrl}"
                            style="
                                display: inline-block;
                                background: #2563EB;
                                color: white;
                                padding: 14px 24px;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                            "
                        >
                            Reset Password
                        </a>

                    </div>

                    <p style="
                        color: #64748B;
                        font-size: 14px;
                    ">
                        This password reset link will
                        expire in 15 minutes.
                    </p>

                    <p style="
                        color: #64748B;
                        font-size: 14px;
                    ">
                        If you did not request a password
                        reset, you can safely ignore this email.
                    </p>

                </div>

                <div style="
                    text-align: center;
                    padding: 15px;
                    color: #64748B;
                    font-size: 12px;
                ">
                    © CareerGuide
                </div>

            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendPasswordResetEmail,
};