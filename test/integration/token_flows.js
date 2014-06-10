var should = require('should');
var request = require('supertest');

var baseUrl = '/token';
var resourceUrl;

var validUserCredentials = {
  username: 'username',
  password: 'password'
};

describe('/token', function () {
  before(function (done) {
    User.destroy(function () {
      User.create(validUserCredentials, function (err, user) {
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
        .send({ password: validUserCredentials.password })
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
        .send({ username: validUserCredentials.username })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.error.invalidAttributes.should.have.property('password');
          done();
        });
    });

    it('should return 401 for incorrectly cased password', function (done) {
      request(sails_app)
        .post(baseUrl)
        .send({ username: validUserCredentials.username, password: 'Password' })
        .expect(401, done);
    });

    it('should return token for correct user name and password'/*, function (done) {
      request(sails_app)
        .post(baseUrl)
        .send(validUserCredentials)
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.token.should.be.ok;
          done();
        });
    }*/);

    it('should return token for any cased user name with correct password'/*, function (done) {
      request(sails_app)
        .post(baseUrl)
        .send(validUserCredentials)
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.token.should.be.ok;
          done();
        });
    }*/);
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
