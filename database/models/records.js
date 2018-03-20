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
            message: '{VALUE} must not have spaces'
          },
    },
});

// mongoose Model
module.exports = mongoose.model('Record', RecordSchema);
