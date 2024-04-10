const nodemailer = require("nodemailer");
const Constants = require('../Constants');
var ejs = require("ejs");
const { EMAIL_AUTH,USER_EMAIL_FROM } = require("../Constants");

const sendEmail = async (emailTo, subject,data) => {

 let apiObj=data
 console.log("dynamic values",apiObj)
    
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: Constants.MAIL_PORT,
            type: "SMTP",
            host: "smtp.gmail.com",
            secure: true,
            auth: {
                user: EMAIL_AUTH.user,
                pass: EMAIL_AUTH.pass,

            },
        });

       
         ejs.renderFile('./EmailTemplates/CarelineEmail/carelineemail.ejs', { ...apiObj}, async function (err, data) {
           

            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from:  'Facility Management<' + EMAIL_AUTH.user + '>',
                    //  to: "<ramawtar.saini@girnarsoft.com>",
                    // to: "<lubaidkhan111@gmail.com>",
                    to:`<${emailTo}>`,
                    //  cc:"<monika.bidawat@girnarsoft.com>",
                    subject: subject,
                    // text: text,
                    html: data,
                    replyTo: EMAIL_AUTH.user
                };
                console.log(mainOptions)
                await transporter.sendMail({
                    ...mainOptions

                });
                 transporter.close();
            }
        })


        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;