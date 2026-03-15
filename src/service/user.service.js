import { User } from '../models/User.js';

const userService = { 
    async createUser(userData) {
        const { studentId, password, name } = userData;
        const existingUser = await User.findOne({ studentId });
        if (existingUser) {
            throw new Error('Mã sinh viên này đã tồn tại');
        }
        const user = await User.create({ studentId, password, name });
        return user;
    },

    async getUserById(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async getAllUsers(excludeUserId = null) {
        const query = excludeUserId ? { _id: { $ne: excludeUserId } } : {};
        return await User.find(query)
            .select('name studentId avatar isOnline lastActive')
            .sort({ isOnline: -1, name: 1 });
    },

    async updateUser(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
};

export default userService;
