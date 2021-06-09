exports.test = (req, res, next) => {
    console.log('middleware started', req.body, 'middleware stopped');
    //some validations go here
    req.body.isValid = true;
    if(req.body.isValid){
        next();
    }else{
        res.status(401).send({status: 'failed', message: 'Request is not valid'});
    }
}