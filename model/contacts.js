//check if you installed mongoose
const mongoose = require('mongoose');

const contacts = new mongoose.Schema({
    userName: String,
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        minLength: [5, 'my custom error message'],
        maxLength: 15
    },
    address: String,
    avatar: String,
    userId: String
});

//first 'users' is the collection name, the second one is the constant
module.exports = mongoose.model('contacts', contacts);