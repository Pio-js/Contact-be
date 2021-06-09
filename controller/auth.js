const users = require('../model/users');
const jwt = require('jsonwebtoken');
const jwtSKey = process.env.JWT_SKEY;
const bcrypt = require('bcrypt');

exports.registerPost = async (req, res) => {
    //you could write as above
    /* const email = req.body.email;
    const pass = req.body.pass;
    //or
    const {email, pass} = req.body; */
    let {email, pass} = req.body;
    pass = await bcrypt.hash(pass, 10);
    const newUser = new users({email, pass});

    users.findOne({email:req.body.email}, (err, doc) => {
        if (err) {
            console.log(err);
            res.send({status:'failed', message: err});
        } else if(doc !== null) {
            res.status(406).send(({status:'failed', message: 'Please try different email!'}));
        } else {
            newUser.save((err, doc)=>{
                if (err) {
                    console.log(err);
                    res.send({status:'failed', message: err});
                } else {
                    console.log(doc);
                    res.send(({status:'success', message: 'The account is created successfully'}));
                }
            });
        }
    });
}

exports.loginPost = (req, res) => {
    let {email, pass} = req.body;

    users.findOne({email}, async (err, doc) => {
        if(err){
            console.log(err);
            res.send({status: 'failed', message:err});
        }else if(doc === null){
            res.status(406).send({status: 'failed', message:'Please try a different email!'});
        }else{

            const match = await bcrypt.compare(pass, doc.pass);

            if(match){
                const token = jwt.sign({id: doc._id}, jwtSKey, {expiresIn: '1d'});
                res.send({status: 'success', message:'User logged in successfully!', token});
            }else{
                res.send({status: 'failed', message:'There is an error, please try again later!'});
            }
        }
    })
}