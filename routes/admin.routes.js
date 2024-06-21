import express from "express";
import { getAdmin, getListings } from "../controllers/admin.controller.js";
import { adminSignIn, adminSignUp, getUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.post('/signup', adminSignUp);
router.post('/signin', adminSignIn);
router.get('/listings', getListings);
router.get('/users', getUsers);
router.get('/:id', getAdmin);


export default router;

