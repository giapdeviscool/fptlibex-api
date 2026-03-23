import walletService from "../service/wallet.service.js";

class WalletController {
    static async deposit(req, res) {
        try {
            const userId = req.user._id; // from verifyToken middleware
            const { amount, description } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, message: "Số tiền không hợp lệ" });
            }

            const result = await walletService.deposit(userId, amount, description);
            return res.status(200).json({ success: true, data: result, message: "Nạp tiền thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async withdraw(req, res) {
        try {
            const userId = req.user._id;
            const { amount, bankInfo } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, message: "Số tiền không hợp lệ" });
            }

            const result = await walletService.withdraw(userId, amount, bankInfo);
            return res.status(200).json({ success: true, data: result, message: "Yêu cầu rút tiền thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getBalance(req, res) {
        try {
            const userId = req.user._id;
            const result = await walletService.getBalance(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getHistory(req, res) {
        try {
            const userId = req.user._id;
            const history = await walletService.getHistory(userId);
            return res.status(200).json({ success: true, data: history });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default WalletController;
