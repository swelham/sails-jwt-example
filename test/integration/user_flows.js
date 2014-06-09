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
        .expect(404)
        .end(done);
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
});
