// if we are in the production environment, export the actual environment variables
// otherwise, attempt to pull the environment variables from an environment file
if (process.env.NODE_ENV === 'production') {
    module.exports = process.env;
} else {
    // if this line is throwing an error, you probably need to add a file in this directory called "environment.json"
    // this is a security measure to ensure that we don't commit credentials to github
    try {
        module.exports = require('./environment.json');
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            throw new Error('Missing server/environment/environment.json - see server/environment/exampleEnvironment.json');
        } else {
            throw new Error(err);
        }
    }
}
