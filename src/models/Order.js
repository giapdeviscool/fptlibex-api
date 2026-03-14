const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
            default: "pending",
        },
        statusLabel: {
            type: String,
            enum: ['Đang chờ', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'],
            default: 'Đang chờ',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);