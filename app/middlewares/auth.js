var verifier = require('google-id-token-verifier');
var clientId = require('../../config/files/local-auth').clientId;

module.exports = function(req, res, next) {
    console.log('checking auth');
    if (!req.query || !req.query.idToken) {
        console.log('no auth token provided');
        res.redirect('/403');
        return;
    }

    var idToken = req.query.idToken;
    verifier.verify(idToken, clientId, function (err, tokenInfo) {
        if (err) {
            console.log('invalid auth token');
            res.redirect('/403');
            return;
        }
        req.user = {

        };
        console.log(tokenInfo);
        next();
    });
};
