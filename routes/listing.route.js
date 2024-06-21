import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, likeListing, unLikeListing, addComment, removeComment } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', createListing);
router.delete('/delete/:id', deleteListing);
router.post('/update/:id', updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.put('/like-listing', likeListing)
router.put('/unlike-listing', unLikeListing)
router.put('/add-comment', addComment)
router.put('/remove-comment', removeComment)

export default router;
