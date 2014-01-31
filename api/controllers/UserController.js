
module.exports = {

    index: function (req, res) {
        res.send(req.user);
    },

    create: function (req, res) {
        UserManager.createUser({
            username: req.param('username'),
            password: req.param('password')
        }, function (err, user) {
            if (err) return res.send(500);

            if (!user) {
                return res.send('This username is already in use', 400);
            }
            
            UserManager.generateUserToken(user, function (err, token) {
                if (err) return res.send(500);
                
                return res.send(token, 201);
            });
        });
    },
    
   login: function (req, res) {
        UserManager.authenticateUserPassword(req.param('username'), req.param('password'),
            function (err, user) {
                if (err) return res.send(500);
                if (!user) return res.send(401);

                UserManager.generateUserToken(user, function (err, token) {
                    if (err) return res.send(500);
                    
                    return res.send(token, 200);
                });
            }
        );
    },

    forgotPassword: function (req, res) {
        UserManager.generateResetToken(req.param('username'), function (err) {
            if (err) return res.send(500);
            
            res.send(200);
        });
    },

    resetPassword: function (req, res) {
        // todo: add reset via old password
        var token = req.param('token'),
            username = req.param('username'),
            newPassword = req.param('newPassword');

        UserManager.resetPasswordByToken(username, token, newPassword, function (err, user) {
            if (err) return res.send(500);
            if (!user) return res.send(404);

            UserManager.generateUserToken(user, function (err, token) {
                if (err) return res.send(500);
                
                return res.send(token, 200);
            });
        });
    },

    _config: {}
};
