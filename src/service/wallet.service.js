import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";

const walletService = {
    async deposit(userId, amount, description = "Nạp F-Coin") {
        const user = await User.findById(userId);
        if (!user) throw new Error("Không tìm thấy người dùng");

        user.balance = (user.balance || 0) + amount;
        await user.save();
        const transaction = await Transaction.create({
            user: userId,
            type: "deposit",
            amount,
            status: "completed",
            description,
        });

        return {
            balance: user.balance,
            transaction,
        };
    },

    async withdraw(userId, amount, bankInfo) {
        const user = await User.findById(userId);
        if (!user) throw new Error("Không tìm thấy người dùng");

        if ((user.balance || 0) < amount) {
            throw new Error("Số dư không đủ để thực hiện rút tiền");
        }

        user.balance -= amount;
        await user.save();

        const transaction = await Transaction.create({
            user: userId,
            type: "withdraw",
            amount,
            status: "pending",
            description: `Rút tiền về tài khoản: ${bankInfo}`,
        });

        return {
            balance: user.balance,
            transaction,
        };
    },

    async getBalance(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error("Không tìm thấy người dùng");
        return { balance: user.balance || 0 };
    },

    async getHistory(userId) {
        const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
        return transactions;
    },
};

export default walletService;
