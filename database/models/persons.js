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
    }
});

// mongoose Model
module.exports = mongoose.model('Person', PersonSchema);
