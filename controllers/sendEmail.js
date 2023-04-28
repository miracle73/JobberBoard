const nodemailer = require('nodemailer')

const sendEmail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ciara74@ethereal.email',
            pass: 'wnUQtQ9h3ukBV1jWvN'
        }
    });

    await transporter.sendMail({
        from: "Nwadiaro Miracle <nwadiaromiracle@yahoo.com",
        to: "miraclenwadiaro@yahoo.com",
        subject: "Application Approval",
        text: "This is to inform you that your application has been approved",
        html: "<p>This is to inform you that your application has been approved</p> "
    })
    res.json("Email Sent")
}

module.exports = sendEmail