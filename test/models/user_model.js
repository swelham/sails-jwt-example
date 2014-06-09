var should = require('should');

var data;

describe('user_model', function () {
  after(function (done) {
    User.destroy(done);
  });

  describe('#toJSON', function () {
    var userJson;

    before(function (done) {
      User.create({
        username: 'user_tojson_test',
        password: 'password'
      }, function (err, user) {
        if (err) return done(err);

        userJson = user.toJSON();
        done();
      });
    });

    it('should not return security attributes', function () {
      userJson.should.not.have.property('password');
      userJson.should.not.have.property('salt');
      userJson.should.not.have.property('locked');
      userJson.should.not.have.property('passwordFailures');
      userJson.should.not.have.property('lastPasswordFailure');
      userJson.should.not.have.property('resetToken');
    });
  });

  describe('#create', function () {
    beforeEach(function (done) {
       data = {
        username: 'user_create_test',
        password: 'password'
      };

      User.destroy(done);
    });

    it('should correctly set attributes', function (done) {
      var originalPassword = data.password;

      User.create(data, function (err, user) {
        if (err) return done(err);
        
        user.username.should.equal(data.username);
        user.password.should.be.ok;
        user.password.should.not.equal(originalPassword);
        user.salt.should.be.ok;
        user.locked.should.be.false;
        user.passwordFailures.should.equal(0);
        (user.lastPasswordFailure === null).should.be.true;
        (user.resetToken === null).should.be.true;

        done();
      });
    });

    it('should enforce unique usernames', function (done) {
      User.create(data, function (err, user) {
        if (err) return done(err);

        User.create(data, function (dupErr) {
          dupErr.code.should.equal('E_VALIDATION');
          dupErr.invalidAttributes.should.have.property('username');

          done();
        });
      });
    });

  });
});