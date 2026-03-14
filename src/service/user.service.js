import { User } from '../models/User.js';

const userService = { 
    async createUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const user = await User.create(userData);
        return user;
    },

    async getUserById(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async getAllUsers() {
        return await User.find();
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
