//install mongoose if you didn't it before
const mongoose = require('mongoose');

//check the DB name
dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
    await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log('Mongo is ready!');
    } catch (err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB; //don't forget to call it in app.js