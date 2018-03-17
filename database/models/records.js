const mongoose = require('mongoose');

// mongoose Schema
const RecordSchema = new mongoose.Schema({
    key: { 
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    personId: {
        type: String,
        required: true,
        index: true,
    }
});

// mongoose Model
module.exports = mongoose.model('Record', RecordSchema);
