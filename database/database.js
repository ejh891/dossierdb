const mongoose = require('mongoose');
mongoose.Promise = Promise;

const env = require('../environment/env');

class Database {
    static connect() {
        mongoose.connect(
            env.MONGODB_URI
        )
        .catch((err) => {
            console.error('Error connecting to MLab Database.', err);
        });
    }

}

module.exports = Database;