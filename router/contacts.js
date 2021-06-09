const router = require('express').Router();
const contactsController = require('../controller/contacts');
const testMid = require('../middlewares/test');
const logMid = require('../middlewares/log');

router.post('/new', logMid.logger, testMid.test, contactsController.contactPost);
router.get('/all', logMid.logger, contactsController.getAll);
router.delete('/:contactId', logMid.logger, contactsController.deleteContact);
router.post('/update', logMid.logger, contactsController.updateContact);

module.exports = router;