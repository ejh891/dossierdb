/**
 * Adds standard Cache-Control and Expires headers to the response
 * @param {number|null} expirationSeconds - number of seconds before this response is considered stale or null if the response should not be cached
 */
module.exports = (expirationSeconds) => {
    return (req, res, next) => {
        let cacheControl;
        let expires;

        if (expirationSeconds === null) {
            cacheControl = 'no-store';
        } else {
            const expirationMS = expirationSeconds * 1000;
            cacheControl = `public, max-age=${expirationSeconds}`;
            expires = new Date(Date.now() + expirationMS).toUTCString();
        }

        res.set({
            'Cache-Control': cacheControl,
            'Expires': expires
        });

        next();
    }
}
