import userRepository from '../database/repository/user.repository.js';

const userService = { 
    async createUser(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const user = await userRepository.create(userData);
        return user;
    },

    async getUserById(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async getAllUsers() {
        return await userRepository.findAll();
    },

    async updateUser(userId, updateData) {
        const user = await userRepository.update(userId, updateData);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async deleteUser(userId) {
        const user = await userRepository.delete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
};

export default userService;
