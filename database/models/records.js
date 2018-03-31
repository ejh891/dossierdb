const mongoose = require('mongoose');

// mongoose Schema
const RecordSchema = new mongoose.Schema({
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
    path: {
        type: String,
        default: '/',
        lowercase: true,
        validate: {
            validator: (value) => {
              return (
                  value.indexOf(' ') === -1 &&
                  value.startsWith('/') &&
                  value.endsWith('/')
              );
            },
            message: '{VALUE} must not have spaces and must start/end with a slash'
          },
    },
});

// mongoose Model
module.exports = mongoose.model('Record', RecordSchema);
