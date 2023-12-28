// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {

//     const transporter = await nodeMailer.createTransport({

//         host: "smtp.ethereal.email",
//         port: 587,
//         // service: process.env.SMPT_SERVICE,
//         auth: {

//             user: 'juwan.purdy@ethereal.email',
//             pass: 'zpMjE7zkEZM7929PZQ'

//         }

//     });

//     const mailOptions = {

//         from: '"Manish Kaswan" <manishkaswan88@getMaxListeners.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message

//     }

//     const info = await transporter.sendMail(mailOptions);

//     console.log('Message sent: %s', info.messageId);

// };

// module.exports = sendEmail;



const nodemailer = require("nodemailer");

const sendMail = async(str , data , message) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "manishkaswan88@gmail.com",
          pass: "xnnsfgcilvqarymq",
        },
      });
      
    var Osubject,Otext,Ohtml;

    if(str == "signup") {
        Osubject = `Thank You for signing ${data.name}`;
        Ohtml = `
        <h1>Welcome to FoodApp.com</h1>
        Hope you have a good time!
        Here are your details-
        Name:- ${data.name}
        Email:- ${data.email}
        `
    }
    else if(str == "resetpassword") {
        Osubject = `Reset Password`;
        Ohtml = `${message}`
    }

    const info = await transporter.sendMail({
        from: '"E-commerce" <manishkaswan88@gmail.com>',
        to: data.email, 
        subject: Osubject,  
        html: Ohtml, 
    });
    
    console.log("Message sent: %s", info.messageId); 
    console.log(Osubject);     
};

module.exports = sendMail;