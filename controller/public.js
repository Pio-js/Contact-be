const contacts = require("../model/contacts");
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');
const { log } = require('console');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'attachments')
    },
    filename: function (req, file, cb) {
        console.log(123, file);
        cb(null, 'f' + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage }).array('attachments')

exports.about = (req,res) => {
    contacts.find({}, (err, docs)  => {
        if(err){
            res.render('about', {testData: 'There is an error, please try again!'});
        }else{
            res.render('about', {testData: docs});
        }
    })
    
}

exports.getContact = (req, res) => {
    upload(req, res, async (err) => {
        if(err){
            console.log(err);
        }
        console.log(req.body, req.files);
    
        try {

            //let testAccount = await nodemailer.createTestAccount();
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL, //to send emails set authorization - use link below
                pass: process.env.GMAIL //https://www.google.com/settings/security/lesssecureapps
            },
            });

            const attachments = () => {
                return req.files? req.files.map(file=>{return{path:file.path}}) : [];
            }
            console.log(attachments());
            /* host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password --- use .env to set your pass - process.env.GMAIL for ex.
            } */
            // send mail with defined transport object
            let info = await transporter.sendMail({
            from: '"Customer support" <pio.saija@gmail.com>', // sender address
            to: "pio.saija@web.de", // list of receivers
            subject: "Ticket from: " + req.body.fullName, // Subject line
            text: req.body.message, // plain text body
            html: `<b>${req.body.message}</b>`, // html body
            attachments: attachments()
            });


            console.log("Message sent: %s", info.messageId);
            res.json({status: 'success', message: 'Congratulation! You sent your message!'});
            // Preview only available when sending through an Ethereal account
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
            res.status(401).json({status: 'failed', message: err});
        }
    });
}