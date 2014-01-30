
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.name);
});
 
passport.deserializeUser(function(name, done) {
    User.findOne({ name: name }, function(err, user) {
       if (err) return done(err);
       if (!user) return done(null, null);
       return done(err, user);
   });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function () {
            User.findOne({ name: username }, function(err, user) {
               if (err) return done(err);
               if (!user || user.password !== password) return done(null, false);
               return done(null, user);
            });
        });
    }
));

module.exports = {
    appName: 'sails_api',
    port: 1337,
    environment: 'development',
    logs: {
        level: 'verbose'
    },
    express: {
        customMiddleware: function (app) {
            app.use(passport.initialize());
        }
    }
};