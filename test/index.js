var Sails = require('sails');

before(function (done) {
  this.timeout(5000);

  var config = {
    log: {
      level: 'error'
    }/*,
    connections: {
      default: 'localDiskDb'
    }*/
  };

  Sails.lift(config, function (err, s) {
    if (err) return done(err);

    console.log('sails lift\n');
    global.sails_app = s.hooks.http.app;

    done();
  });
});

after(function (done) {
  this.timeout(5000);
  console.log('sails lower');
  Sails.lower(done);
});