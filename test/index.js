var sails = require('sails');

before(function (done) {
  this.timeout(0);

  var config = {
    log: {
      level: 'error'
    },
    connections: {
      default: 'testDb'
    }
  };

  sails.lift(config, function (err, sails) {
    if (err) return done(err);

    console.log('sails lift\n');
    done();
  });
});

after(function (done) {
  this.timeout(0);
  console.log('sails lower');
  sails.lower(done);
});