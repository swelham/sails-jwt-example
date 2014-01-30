
module.exports = function (req, res, next) {
    // currently just using url query for testing
    // this will actually come from the http header
    var issueDate = req.headers["x-token-issued"];
    var tokenValue = req.headers["x-token"];
    
    // validate we have all params
    if (!tokenValue || !issueDate) {
        return res.send('Auth not sent', 400);
    }
    
    // validate token and set req.user if we have a valid token
    UserManager.authenticateUserToken(tokenValue, issueDate, function (err, user) {
        if (err) {
            if (err.message === 'invalid-token') return res.send(401);

            return res.send(500);
        }

        if (!user) return res.send(404);
        
        req.user = user;

        next();
    });
};