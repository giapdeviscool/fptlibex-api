import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            default: '',
        },
        isRead: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.model("Message", messageSchema);
