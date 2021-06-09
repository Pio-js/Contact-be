const logModel = require('../model/logs');

exports.logger = (req, res, next) => {
    const log = new logModel({
        dateTime: Date.now(),
        path: req.originalUrl //contacts/all <-- look at the route contacts.js
    });
    
    log.save((err, docs) => {
        console.log(err);
        if(err){
            res.status(500).send({status: 'failed', message: 'Please try again', data: err.errors});
        }else{
            req.logId = docs._id;
            next();
        }
    });
    
}