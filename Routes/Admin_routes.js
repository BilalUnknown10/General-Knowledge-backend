const router = require('express').Router();
const { uploadMCQ } = require('../Controllers/Admin_controller');
const authMiddleware = require('../Middlewares/Auth_middleware');

router.route('/uploadMCQ').post(authMiddleware, uploadMCQ);



module.exports = router;