import express from 'express';
import { deleteUser, test, updateUser,  getUserListings, getUser, getLikedListings, resetPassword} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test)
router.get('/likedlistings/:id', getLikedListings)
router.post('/update/:id',  updateUser)
router.delete('/delete/:id', deleteUser)
router.get('/listings/:id', getUserListings)
router.get('/:id', getUser)
router.post('/resetpassword', resetPassword)

export default router;