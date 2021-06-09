const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    pass: {
        type: String,
        required: true,
        minLength: [8, 'Password must have at least 8 characters']
    }
});

//first 'users' is the collection name, the second one is the constant
module.exports = mongoose.model('users', usersSchema);