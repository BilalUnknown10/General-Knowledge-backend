const router = require('express').Router();
const authMiddleware = require('../Middlewares/Auth_middleware');
const upload = require('../Middlewares/Multer_middleware');
const {
    userRegistration,
    userLogin,
    userLogout,
    editUserProfileImage,
    userSubmitAnswer,
    userVerificationOTP,
    userEmailVerification,
} = require('../Controllers/User_controller');

// User routes
router.route('/userRegistration').post(userRegistration);
router.route('/userLogin').post(userLogin);

// protected route
router.route('/userLogout').post(authMiddleware, userLogout);
router.route('/editUserProfileImage').post(authMiddleware, upload.single("profileImage"), editUserProfileImage);
router.route('/userSubmitAnswer/:id').post(authMiddleware, userSubmitAnswer);
router.route('/userVerificationOTP').post(authMiddleware, userVerificationOTP)
router.route('/userEmailVerification').post(authMiddleware, userEmailVerification);



module.exports = router;