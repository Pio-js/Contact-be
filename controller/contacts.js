const contacts = require('../model/contacts');
const logs = require('../model/logs');
const multer = require('multer');//to upload images
const path = require('path');
const fs = require('fs');

//to upload images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, 'a' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage }).single('file');

exports.contactPost = (req, res) => {

    upload(req, res, async (err) => {
        if(err){
            console.log(err);
        }
        console.log('multer', req.body, req.file);

        const {fullName, email, phone, address} = req.body;

        const newContact = new contacts({fullName, email, phone, address, userId: req.userId});
        if (req.file) {
            newContact.avatar = req.file.filename;
        }

        /* await newUser.save(err=>{
            console.log(err);
            if(err){
                res.send(err.errors);
            }else{
                res.send(`${req.body.fullName} is registered on your contact list`);
            }
        }); */

        await newContact.save((err, docs) => {
            //console.log(err);
            if(err){
                res.send(err.errors);
            }else{
                res.send(docs);
                logs.findByIdAndUpdate(req.logId, {postData: JSON.stringify(docs)}, (err, doc)=>console.log({err, doc}));
            }
        });
    })
    console.log('controller', req.body);
    //to use req.body we need to use any parser (as in app.js --> app.use(express.json());)
    /* const {fullName, email, phone, address} = req.body;
    console.log({fullName, email, phone, address}); */
    //create user
    /* const newUser = new users({
        fullName,
        email,
        phone,
        address
    }); */

    //optionally: const newUser = new users(req.body)  --> delete from row 5 to 13;
    //but then you must change in res.send --> req.body.fullName
    //this could be done if there is no other input field or form in the page, maybe? there is the model?

    //save the user in db - in the model you create the structure, how it must be written in the db
    /* newUser.save().then(result => {
    res.send(`Hi ${fullName}! You applied successfully!`);
    }); */
    
}

//to create cards for all contacts
exports.getAll = (req,res) => {
    contacts.find({userId: req.userId}, (err, docs) => {
        if(err){
            res.status(500).send({status: 'failed', message: err});
        }else{
            res.send({status: 'success', message: 'All data fetched successfully!', data: docs});
        }
    });
}

exports.deleteContact = (req, res) => {
    const id = req.params.contactId;
    //const avatar =;
    
    contacts.findByIdAndDelete(id, (err, doc) => {
        console.log(err, doc);
        if(err){
            res.send({status:'failed', message: err});
        }else if(doc === null){
            res.send({status:'failed', message:'There was no contact'});
        }else{
            logs.findByIdAndUpdate(req.logId, {preData: JSON.stringify(doc)}, (err, doc)=>{});

            try {
                fs.unlinkSync('public/avatars/'+doc.avatar);
                console.log(doc.avatar + 'successfully deleted');
            } catch (err) {
                
            }

            res.send({status:'success', message: `${doc.fullName} is deleted from your contact list`, data:doc.id});
        }
    })
    //res.send({status:'test', message: req.params.id});
}

exports.updateContact = (req, res) => {

    upload( req, res, (err) => {
        if (err) {
            console.log('err',err);
        }
        console.log('multer', req.body, req.file);

        console.log(req.body);
        const contact = {...req.body }
        if (req.file) {
            contact.avatar = req.file.filename;
        }



        contacts.findByIdAndUpdate(contact._id, contact, {upsert: true, runValidators: true}, (err,doc)=>{
            if (err) {
                console.log(err);
                res.send({status:'failed', message: err});
            } else {
                //to delete the old image
                if(contact.avatar){
                    try {
                        fs.unlinkSync('public/avatars/'+doc.avatar);
                        console.log(doc.avatar + 'successfully deleted');
                    } catch (err) {

                    }
                }
                console.log(doc);
                logs.findByIdAndUpdate(req.logId, {preData: JSON.stringify(doc), postData: JSON.stringify(contact)}, (err) => {});
                res.send(({status:'success', message: 'Contact updated successfully'}));
            }
        });
    });

    
    //if you want to change and update just one field you can use the code below:

    //const updateContact = await users.findById(contact._id);

    /* updateContact.fullName = contact.fullName;
    updateContact.email = contact.email;
    updateContact.phone = contact.phone;
    updateContact.address = contact.address; */

    //with forEach is to connect every object key in the array as above
    /* Object.keys(contact).forEach(key => updateContact[key] = contact[key]);
    updateContact.save((err, doc) => {
        if(err){
            console.log(err);
            res.send({status: 'failed', message: err});
        }else{
            console.log(doc);
            res.send({status: 'success', message: 'Contact updated successfully!'});
        }
    }) */
}