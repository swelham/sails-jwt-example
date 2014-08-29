var should = require('should');
var request = require('supertest');
var merge = require('merge');

var baseUrl = '/token';
var resourceUrl;

var userCredentials = {
  username: 'username',
  password: 'password'
};

describe('/token', function () {
  before(function (done) {
    User.destroy(function () {
      var clonedCredentials = merge(true, userCredentials);

      User.create(clonedCredentials, function (err, user) {
        if (err) return done(err);

        resourceUrl = baseUrl + '/' + user.id;
        done();
      });
    });
  });

  describe('GET', function () {
    it('should return 404', function (done) {
      request(sails_app)
        .get(resourceUrl)
        .expect(404, done);
    });
  });

  describe('POST ', function() {
    it('should return 400 for missing username', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send({ password: userCredentials.password })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.error.invalidAttributes.should.have.property('username');
          done();
        });
    });

    it('should return 400 for missing password', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send({ username: userCredentials.username })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.error.invalidAttributes.should.have.property('password');
          done();
        });
    });

    it('should return 401 for incorrect password', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send({ username: userCredentials.username, password: 'wrong_password' })
        .expect(401, done);
    });
    
    it('should return 401 for incorrectly cased password', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send({ username: userCredentials.username, password: 'Password' })
        .expect(401, done);
    });

    it('should return token for correct username and password', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send(userCredentials)
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.token.should.be.ok;
          done();
        });
    });

    it('should return token for any cased username with correct password', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send({
          username: 'Username',
          password: userCredentials.password
        })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.token.should.be.ok;
          done();
        });
    });
  });

  describe('PUT', function () {
    it('should return 404', function (done) {
      request(sails_app)
        .put(resourceUrl)
        .expect(404, done);
    });
  });

  describe('DELETE', function () {
    it('should return 404', function (done) {
      request(sails_app)
        .delete(resourceUrl)
        .expect(404, done);
    });
  });
});
