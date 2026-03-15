import mongoose from "mongoose";
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        unreadCount: { 
            type: Map, 
            of: Number, 
            default: {} 
        }
    },
    {
        timestamps: true,
    }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
