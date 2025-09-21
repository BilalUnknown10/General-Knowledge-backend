const router = require('express').Router();
const {
    uploadMCQ,
    getOneMCQ,
    editMCQ,
    deleteMCQ,
    getAllMCQS,
    getAllUsers
} = require('../Controllers/Admin_controller');
const authMiddleware = require('../Middlewares/Auth_middleware');

router.route('/uploadMCQ').post(authMiddleware, uploadMCQ);
router.route('/getOneMCQ/:MCQId').get(authMiddleware, getOneMCQ);
router.route('/editMCQ/:MCQId').patch(authMiddleware, editMCQ);
router.route('/deleteMCQ/:MCQId').delete(authMiddleware, deleteMCQ);
router.route('/allMCQS').get(authMiddleware,getAllMCQS);
router.route('/allUsers').get(authMiddleware,getAllUsers);




module.exports = router;