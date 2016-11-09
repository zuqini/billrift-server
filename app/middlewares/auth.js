var verifier = require('google-id-token-verifier');
var clientId = require('../../config/files/local-auth').clientId;

module.exports = function(req, res, next) {
    if (!req.query || !req.query.idToken) {
        console.log('No auth token provided.');
        res.redirect('/403');
        return;
    }

    var idToken = req.query.idToken;
    verifier.verify(idToken, clientId, function (err, tokenInfo) {
        if (err) {
            console.log(err);
            res.redirect('/403');
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
