var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');

// this would need to live in sails config
var jwtSecret = 'xStmbyc066BOFn40gIr29y09Ud94z1P7';

function hash(value, salt, done) {
    salt = salt || bcrypt.genSaltSync();

    bcrypt.hash(value, salt, null, function (err, hash) {
        if (err) return done(err);

        done(null, hash, salt);
    });
}

function doesUsernameExist (username, done) {
    User
        .findOne({ username: username })
        .done(function (err, user) {
            if (err) return done(err);

            return done(null, !!user);
        });
}

module.exports = {
    hashPassword: function (password, salt, done) {
        hash(password, salt, function (err, hashedPassword, salt) {
            if (err) return done(err);

            done(null, hashedPassword, salt);
        });
    },

    createUser: function (values, done) {
        doesUsernameExist(values.username, function (err, exists) {
            if (err) return done(err);

            if (exists) {
                // todo: a better return result
                return done();
            }

            User.create({
                username: values.username,
                password: values.password
            }).done(function (createErr, user) {
                if (createErr) return done(createErr);

                done(null, user);
            });
        });
    },

    generateUserToken: function (user, done) {
        var issueDate = moment().utc().format(),
        encodedToken = null;

        try {
            encodedToken = jwt.encode({ id: user.id, issued: issueDate }, jwtSecret);
        } catch (err) {
            return done(err);
        }

        return done(null, {
            issued: issueDate,
            token: encodedToken
        });
    },

    authenticateUserToken: function (token, issueDate, done) {
        var issued = moment.utc(issueDate),
            tokenObj = null;

        // check the issue date to see if the token has expired (quick way to kick out expired tokens)
        // to check accurately for minutes we need to check in seconds as moment rounds the result down 
        // to the nearest unit
        if (moment.utc().diff(issued, 'seconds') > 1800) {
            return done(new Error('invalid-token'));
        }

        try {
            tokenObj = jwt.decode(token, jwtSecret);
        } catch (err) {
            return done(err);
        }

        // validate that the issueDate passed in matches the issue date the token was created with
        if (tokenObj.issued !== issueDate) {
            return done(new Error('invalid-token'));
        }
        
        // find the user and set req.user
        User
            .findOne({ id: tokenObj.id })
            .done(function (err, user) {
                if (err) return done(err);

                return done(null, user);
            });
    },

    authenticateUserPassword: function (username, password, done) {
        User
            .findOne({ username: username })
            .done(function (err, user) {
                if (err) return done(err);
                if (!user) return done();

                user.validatePassword(password, function (vpErr, isValid) {
                    if (vpErr) return done(vpErr);
                    if (!isValid) return done();

                    return done(null, user);
                });
            });
    }

    /* 
    todo:
        * reset password
        * forgot password
        * handle account locking
    */
};