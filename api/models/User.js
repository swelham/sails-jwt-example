module.exports = {

    attributes: {
        username: {
            required: true,
            type: 'string'
        },

        password: {
            type: 'string',
            required: true
        },

        salt: {
            type: 'string'
        },

        locked: {
            type: 'boolean',
            defaultsTo: false
        },

        passwordFailures: {
            type: 'integer',
            defaultsTo: 0
        },

        lastPasswordFailure: {
            type: 'datetime'
        },

        toJSON: function () {
            var obj = this.toObject();

            return {
                id: obj.id,
                username: obj.username
            };
        },

        validatePassword: function (password, done) {
            var obj = this.toObject();

            UserManager.hashPassword(password, obj.salt, function (err, hashedPassword) {
                if (err) return done(err);

                done(null, hashedPassword === obj.password);
            });
        }
    },

    beforeCreate: function (values, next) {
        UserManager.hashPassword(values.password, null, function (err, password, salt) {
            if (err) return next(err);

            values.password = password;
            values.salt = salt;
            next();
        });
    }
};