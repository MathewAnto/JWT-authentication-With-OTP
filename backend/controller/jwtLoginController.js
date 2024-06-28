// jwtLoginController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginDataSchema } from '../models/schema.js';
import { sendEmail } from '../middleware/sendMail.js';
import crypto from 'crypto';

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecret';
const saltRounds = 10;

const otpStorage = {}; // Store OTPs temporarily

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

export const registerUser = async (req, res) => {
    const { username, userEmail, password } = req.body;

    try {
        // Check if the username already exists in the database
        const existingUsername = await loginDataSchema.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if the email already exists in the database
        const existingEmail = await loginDataSchema.findOne({ userEmail });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP temporarily
        otpStorage[userEmail] = otp;

        // Send welcome email with OTP
        const subject = "Welcome to GalTech!";
        const text = `Dear ${username},\n\nWelcome! Your account has been successfully created. Your OTP is: ${otp}`;
        await sendEmail(userEmail, subject, text);

        // Respond with success message
        res.status(200).json({ message: "Welcome email with OTP sent successfully"}); // Include username in the response
    } catch (error) {
        // Handle errors
        console.error("Error sending welcome email with OTP: ", error);
        // Delete OTP from temporary storage if sending email fails
        delete otpStorage[userEmail];
        res.status(500).json({ message: "Error sending welcome email with OTP", error: error.message });
    }
};

// Verify OTP and save user data
export const verifyOTPAndSaveUserData = async (req, res) => {
    const { username, userEmail, password, otp } = req.body;

    try {
        // Check if OTP matches the stored OTP
        if (!otpStorage[userEmail] || otpStorage[userEmail] !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clear OTP from temporary storage after successful verification
        delete otpStorage[userEmail];

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance
        const newUser = new loginDataSchema({
            username,
            userEmail,
            password: hashedPassword,
            admin: false
        });

        // Save the new user data to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: "New user data saved successfully", data: newUser });
    } catch (error) {
        // Handle errors
        console.error("Error verifying OTP and saving user data: ", error);
        res.status(500).json({ message: "Error verifying OTP and saving user data", error: error.message });
    }
};

// Get user data
export const getUserData = async (req, res) => {
    try {
        const username = req.user.username;
        const userData = await loginDataSchema.findOne({ username });

        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }

        res.status(200).json({ message: "User data retrieved successfully", data: userData });
    } catch (error) {
        console.error("Error fetching user data: ", error);
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
};

// Login authentication
export const login = async (req, res) => {
    const { username, userEmail, password } = req.body;

    try {
        // Find the user by username or userEmail
        const user = await loginDataSchema.findOne({ $or: [{ username }, { userEmail }] });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign({ username: user.username, role: user.admin ? 'admin' : 'user' }, accessTokenSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.admin ? 'admin' : 'user' }, refreshTokenSecret, { expiresIn: '7d' });

        // Respond with tokens
        res.json({ accessToken, refreshToken });
    } catch (error) {
        // Handle errors
        console.error("Error authenticating user: ", error);
        res.status(500).json({ message: "Error authenticating user", error: error.message });
    }
};
