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
    userDetails,
    getAllQuestions,
} = require('../Controllers/User_controller');

// User routes
router.route('/userRegistration').post(userRegistration);
router.route('/userLogin').post(userLogin);

// protected route
router.route('/userLogout').post(authMiddleware, userLogout);
router.route('/editUserProfileImage').post(authMiddleware, upload.single("profileImage"), editUserProfileImage);
router.route('/userSubmitAnswer/:id').post(authMiddleware, userSubmitAnswer);
router.route('/userVerificationOTP').get(authMiddleware, userVerificationOTP)
router.route('/userEmailVerification').post(authMiddleware, userEmailVerification);
router.route('/userDetails').get(authMiddleware, userDetails);
router.route('/getAllQuestions').get(authMiddleware, getAllQuestions);



module.exports = router;