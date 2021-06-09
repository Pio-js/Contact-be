const router = require('express').Router();
const controller = require('../controller/public');
//const path = require('path'); required if you do not use hbs


router.get('/about', controller.about);

//without hbs
/* router.get('/about', (req,res) => res.sendFile(path.join(__dirname,'../views/test.html'))); */

module.exports = router;