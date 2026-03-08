import { User } from "../models/User.js";

const userRepository = {
    async create(userData) {
        return await User.create(userData);
    },

    async findById(userId) {
        return await User.findById(userId);
    },

    async findByEmail(email) {
        return await User.findOne({ email });
    },

    async findAll() {
        return await User.find();
    },

    async update(userId, updateData) {
        return await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
    },

    async delete(userId) {
        return await User.findByIdAndDelete(userId);
    }
};

export default userRepository;