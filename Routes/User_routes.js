const router = require('express').Router();

const {
    userRegistration,
    userLogin
} = require('../Controllers/User_controller');


// User routes
router.route('/userRegistration').post(userRegistration);
router.route('/userLogin').post(userLogin)



module.exports = router