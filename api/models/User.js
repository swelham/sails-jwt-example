var bcrypt = require('bcrypt-nodejs');

function hash(value, salt, done) {
  salt = salt || bcrypt.genSaltSync();

  bcrypt.hash(value, salt, null, function (err, hash) {
    if (err) return done(err);

    done(null, hash, salt);
  });
}

module.exports = {

  attributes: {
    username: {
      required: true,
      type: 'string',
      unique: true
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
      type: 'datetime',
      defaultsTo: null
    },

    resetToken: {
      type: 'string',
      defaultsTo: null
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.password;
      delete obj.salt;
      delete obj.locked;
      delete obj.passwordFailures;
      delete obj.lastPasswordFailure;
      delete obj.resetToken;

      return obj;
    },

    comparePassword: function (password, done) {
      var obj = this.toObject();

      hash(password, obj.salt, function (err, hashedPassword) {
        if (err) return done(err);

        done(null, hashedPassword === obj.password);
      });
    }
  },

  beforeCreate: function (values, next) {
    hash(values.password, null, function (err, hash, salt) {
      values.salt = salt;
      values.password = hash;

      next();
    });
  }
};
