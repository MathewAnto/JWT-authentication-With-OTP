import mongoose from 'mongoose';

const jwtLoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    userEmail: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String }, // Add OTP field to the schema,
    admin: { type: Boolean }
}, { timestamps: true });

export const loginDataSchema = mongoose.model('jwtLoginTest', jwtLoginSchema);
