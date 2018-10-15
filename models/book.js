const mongoose = require('mongoose');
const BookSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },

    originalName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    }
});

let Book = module.exports = mongoose.model('Book', BookSchema);