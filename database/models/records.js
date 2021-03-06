const mongoose = require('mongoose');

// mongoose Schema
const RecordSchema = new mongoose.Schema({
    recordType: {
        type: Number,
        required: true,
        default: 1
    },
    title: { 
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
    imageURL: {
        type: String,
        required: false,
    },
    personId: {
        type: String,
        required: true,
        index: true,
    },
});

// mongoose Model
module.exports = mongoose.model('Record', RecordSchema);
