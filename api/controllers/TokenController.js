function buildRequiredError (errors, key, value) {
  if (!errors.invalidAttributes) {
    errors.invalidAttributes = {};
  }

  errors.invalidAttributes[key] = [
    { 
      rule: 'required',
      message: '"required" validation rule failed'
    }
  ];
}

module.exports = {

  create: function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      var attrs = {};

      if (!username) {
        buildRequiredError(attrs, 'username', username);
      }

      if (!password) {
        buildRequiredError(attrs, 'password', password);
      }

      return res.badRequest({ error: attrs });
    }

    User.findOne({ username: username }, function (err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.unauthorized();

      user.comparePassword(password, function (compareErr, matched) {
        if (compareErr) return res.servercompareError(compareErr);
        if (!matched) return res.unauthorized();

        return res.ok();
      });
    });

    return res.ok();
  }
};