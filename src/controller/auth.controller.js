import authService from '../service/auth.service.js';

class AuthController {
    static async register(req, res) {
        try {
            const data = await authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: 'Đăng ký tài khoản thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { studentId, password } = req.body;
            const data = await authService.login(studentId, password);
            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data
            });
        } catch (error) {
            return res.status(401).json({ success: false, message: error.message });
        }
    }

    static async forgotPassword(req, res) {
        try {
            const { studentId } = req.body;
            const resetToken = await authService.forgotPassword(studentId);
            return res.status(200).json({
                success: true,
                message: 'Mã xác nhận đã được tạo (Gửi về mail - demo trả về token)',
                resetToken // Trả về để tiện test
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            await authService.resetPassword(token, newPassword);
            return res.status(200).json({
                success: true,
                message: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default AuthController;
