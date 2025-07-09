const router = require('express').Router();
const { userRegistration } = require('../Controllers/User_controller');

router.route('/userRegistration').post(userRegistration);



module.exports = router