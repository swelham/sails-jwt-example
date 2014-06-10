var sails = require('sails');
var jwt = require('jwt-simple');
var moment = require('moment');

var config = sails.config;

module.exports.serialize = function (user, done) {
  var issued = moment().utc();
  var expires = issued.add(config.jwtExpires.unit, config.jwtExpires.value);

  try {
    var token = jwt.encode({
      user_id: user.id,
      user_name: user.name,
      issued: issued.format(),
      expires: expires.format()
    }, config.jwtKey);

    done(null, token, expires);
  }
  catch (e) {
    return done(e);
  }
};