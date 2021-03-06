/*
auth.js
Middleware
Reference number: 2.1
This describes the authentication that occurs before every API call gets routed
*/
var verifier = require('google-id-token-verifier');

module.exports = function(req, res, next) {
    if (!req.headers['auth-token']) {
        res.status(403).json({ status: 403, error: 'No auth token provided.' });
        return;
    }

    verifier.verify(req.headers['auth-token'], process.env.CLIENT_ID, function (err, tokenInfo) {
        if (err) {
            console.log(err);
            res.status(403).json({ status: 403, error: err.toString()});
            return;
        }
        req.user = {
            name: tokenInfo.name,
            email: tokenInfo.email,
            googleId: tokenInfo.sub
        };
        next();
    });
};
