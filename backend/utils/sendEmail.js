const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {

    const transporter = await nodeMailer.createTransport({

        host: "smtp.ethereal.email",
        port: 587,
        // service: process.env.SMPT_SERVICE,
        auth: {

            user: 'juwan.purdy@ethereal.email',
            pass: 'zpMjE7zkEZM7929PZQ'

        }

    });

    const mailOptions = {

        from: '"Manish Kaswan" <manishkaswan88@getMaxListeners.com>',
        to: options.email,
        subject: options.subject,
        text: options.message

    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

};

module.exports = sendEmail;