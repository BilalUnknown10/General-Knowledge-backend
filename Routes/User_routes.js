const router = require('express').Router();

const {
    userRegistration,
    userLogin,
    userLogout,
    editUserProfileImage
} = require('../Controllers/User_controller');
const authMiddleware = require('../Middlewares/Auth_middleware');
const upload = require('../Middlewares/Multer_middleware');

// User routes
router.route('/userRegistration').post(userRegistration);
router.route('/userLogin').post(userLogin);
router.route('/userLogout').post(authMiddleware, userLogout);
router.route('/editUserProfileImage').post(authMiddleware, upload.single("profileImage"), editUserProfileImage)



module.exports = router;