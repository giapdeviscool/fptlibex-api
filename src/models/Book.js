import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        author: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        originalPrice: {
            type: Number,
            required: true,
        },

        condition: {
            type: String,
            enum: ["Như mới", "Tốt", "Khá", "Cũ"],
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        faculty: {
            type: String,
            enum: ["CNTT", "Kinh tế", "Ngoại ngữ", "Thiết kế", "Marketing", "Khác"],
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Book = mongoose.model("Book", bookSchema);