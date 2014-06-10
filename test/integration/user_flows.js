var should = require('should');
var request = require('supertest');

var baseUrl = '/user';
var resourceUrl;

describe('/user', function () {
  before(function (done) {
    User.destroy(done);
  });

  describe('GET', function () {
    var user;

    before(function (done) {
      User.create({
        username: 'test_get_user',
        password: 'password'
      }, function (err, usr) {
        if (err) return done(err);

        user = usr;
        resourceUrl = baseUrl + '/' + usr.id;

        done();
      });
    });

    it('should return 404', function (done) {
      request(sails_app)
        .get(baseUrl)
        .expect(404, done);
    });

    it('should return a valid user', function (done) {
      request(sails_app)
        .get(resourceUrl)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('id', user.id);
          done();
        });
    });
  });

  describe('POST', function () {
    it('should return 400 for missing username', function (done) {
      request(sails_app)
        .post(baseUrl)
        .set({ password: 'password' })
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
        .set({ username: 'username' })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.error.invalidAttributes.should.have.property('password');
          done();
        });
    });

    it('should return 201 and newly created user', function (done) {
      var data = {
        username: 'test_post_user',
        password: 'password'
      };

      request(sails_app)
        .post(baseUrl)
        .send(data)
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          
          res.body.id.should.be.ok;
          res.body.username.should.equal(data.username);
          done();
        });
    });
  });
});
