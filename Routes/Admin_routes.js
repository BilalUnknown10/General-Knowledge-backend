const router = require('express').Router();
const { uploadMCQ } = require('../Controllers/Admin_controller');

router.route('/uploadMCQ').post(uploadMCQ);



module.exports = router;