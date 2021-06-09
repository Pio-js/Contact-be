const router = require('express').Router();
const controller = require('../controller/public');

router.post('/getcontact', controller.getContact);

module.exports = router; 