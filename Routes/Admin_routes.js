const router = require('express').Router();
const {
    uploadMCQ,
    getOneMCQ,
    editMCQ,
    deleteMCQ,
    getAllMCQS,
    getAllUsers,
    getAllFeedbacks,
    deleteAllAnswers,
    deleteAllMCQS,
    deleteUserById
} = require('../Controllers/Admin_controller');
const authMiddleware = require('../Middlewares/Auth_middleware');

router.route('/uploadMCQ').post(authMiddleware, uploadMCQ);
router.route('/getOneMCQ/:MCQId').get(authMiddleware, getOneMCQ);
router.route('/editMCQ/:MCQId').patch(authMiddleware, editMCQ);
router.route('/deleteMCQ/:MCQId').delete(authMiddleware, deleteMCQ);
router.route('/allMCQS').get(authMiddleware,getAllMCQS);
router.route('/allUsers').get(authMiddleware,getAllUsers);
router.route('/allFeedbacks').get(authMiddleware,getAllFeedbacks);
router.route('/deleteAllAnswers').delete(authMiddleware, deleteAllAnswers);
router.route('/deleteAllMCQS').delete(authMiddleware, deleteAllMCQS);
router.route('/deleteUserById/:_id').delete(authMiddleware, deleteUserById);

module.exports = router;