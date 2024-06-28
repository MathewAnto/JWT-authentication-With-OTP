import express from 'express';
import { registerUser, verifyOTPAndSaveUserData, login, getUserData } from '../controller/jwtLoginController.js';
import { authenticateJWT } from '../middleware/authenticate.js';

export const router = express.Router();

router.post('/register', registerUser); // Endpoint for user registration
router.post('/verifyOTP', verifyOTPAndSaveUserData); // Endpoint for verifying OTP and saving user data
router.post('/login', login); // Endpoint for user login

router.get('/protected', authenticateJWT, getUserData); // Protected endpoint to get user data
