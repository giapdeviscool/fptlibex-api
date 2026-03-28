import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    studentId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    balance: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: false });


export const User = mongoose.model('User', userSchema);