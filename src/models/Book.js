const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
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
            type: String,
            required: true,
        },

        faculty: {
            type: String,
            enum: ["CNTT", "Kinh tế", "Ngoại ngữ", "Thiết kế", "Marketing", "Khác"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Book", bookSchema);