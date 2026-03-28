import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import crypto from 'crypto';

const authService = {
    // Register new user
    async register(userData) {
        const { studentId, password, name } = userData;

        const existingUser = await User.findOne({ studentId });
        if (existingUser) {
            throw new Error('Mã sinh viên này đã được đăng ký!');
        }

        const user = await User.create({
            name,
            studentId,
            password
        });

        return user;
    },

    // Login user
    async login(studentId, password) {
        const user = await User.findOne({ studentId });
        if (!user) {
            throw new Error('Mã sinh viên không chính xác!');
        }

        const isMatch = user.password === password;
        if (!isMatch) {
            throw new Error('Mật khẩu không chính xác!');
        }

        if (user.isBanned) {
            throw new Error('Tài khoản của bạn đã bị khóa bởi quản trị viên!');
        }

        const token = this.generateToken(user.role, user.studentId, user._id);
        return { user, token };
    },

    // Forgot password (Generate token)
    async forgotPassword(studentId) {
        const user = await User.findOne({ studentId });
        if (!user) {
            throw new Error('Không tìm thấy tài khoản với mã sinh viên này!');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();
        return resetToken;
    },

    // Reset password
    async resetPassword(token, newPassword) {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Token đổi mật khẩu không hợp lệ hoặc đã hết hạn!');
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        return user;
    },

    // Helper: Generate JWT
    generateToken(role, studentId, _id) {
        return jwt.sign(
            { role, studentId, _id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );
    }
};

export default authService;
