var verifier = require('google-id-token-verifier');

module.exports = function(req, res, next) {
    req.user = {
        name: "Test User",
        email: "test@test.test",
        googleId: "0000000000"
    };
    next();
};
