import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    phone_number: { type: String, default: '' },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/] },
    password: { type: String, required: true },
}, { timestamps: true, versionKey: false });

export const User = mongoose.model('User', userSchema);