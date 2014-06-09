
describe('user_model', function () {
  before(function () {
    User.destroy(function () { });
  });
  
  describe('#create', function () {
    it('should correctly set attributes', function (done) {
      var data = {
        username: 'user_create_test',
        password: 'password'
      };

      User.create(data, function (err, user) {
        if (err) return done(err);

        user.username.should.equal(data.username);
        user.password.should.be.ok;
        user.salt.should.be.ok;
        user.locked.should.be.false;
        should.not.exist(user.passwordFailures);
        should.not.exist(user.resetToken);
      });
    });
  });
});