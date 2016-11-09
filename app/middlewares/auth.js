var verifier = require('google-id-token-verifier');
var clientId = require('../../config/files/local-auth').clientId;

module.exports = function(req, res, next) {
    if (!req.query || !req.query.idToken) {
        res.status(403).json({ status: 403, error: 'No auth token provided.' });
        return;
    }

    var idToken = req.query.idToken;
    verifier.verify(idToken, clientId, function (err, tokenInfo) {
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
