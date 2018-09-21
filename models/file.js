const mongoose = require('mongoose');
const FileSchema = mongoose.Schema({
    
    // fileId: {
    //     type: String,
    //     required: true
    // },

    category: {
        type: String,
        required: true
    }
});

let File = module.exports = mongoose.model('File', FileSchema);