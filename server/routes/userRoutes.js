import express from 'express';
import jwt from 'jsonwebtoken';
const router= express.Router();
import { 
    signup, signin, getUserProfile, getDashboard } from '../controllers/UserController.js';

import { protect } from '../middleware/authMiddleware.js'

router.get("/",(req,res)=>{
    res.send(" Server is ready")
})

router.post("/signup", signup);
router.post("/signin", signin);


router.get("/dashboard/:userId",getDashboard)

export default router;