var verifier = require('google-id-token-verifier');
var clientId = require('../../config/auth').clientId;

module.exports = function(req, res, next) {
    if (!req.headers['auth-token']) {
        res.status(403).json({ status: 403, error: 'No auth token provided.' });
        return;
    }

    verifier.verify(req.headers['auth-token'], clientId, function (err, tokenInfo) {
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
