/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  create: function (req, res) {
    User.create({
      username: req.body.username,
      password: req.body.password
    }, function (err, user) {
      if (err) return res.badRequest(err);

      res.created(user);
    });
  }
};
