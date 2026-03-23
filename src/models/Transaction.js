import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["deposit", "withdraw", "payment", "receive"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "rejected"],
            default: "completed",
        },
        description: {
            type: String,
            default: "",
        },
        orderOrigin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order", // optional, related to specific order if any
        },
    },
    {
        timestamps: true,
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
