import userService from '../service/user.service.js';

class UserController {
    static async create(req, res) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json({ message: 'User created', data: user });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            return res.status(200).json({ data: user });
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({ data: users });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            return res.status(200).json({ message: 'User updated', data: user });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await userService.deleteUser(req.params.id);
            return res.status(200).json({ message: 'User deleted' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};

export default UserController;
