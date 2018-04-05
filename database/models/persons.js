const mongoose = require('mongoose');

// mongoose Schema
const PersonSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    profilePhotoURL: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        required: true,
        index: true,
    }
});

// mongoose Model
module.exports = mongoose.model('Person', PersonSchema);
