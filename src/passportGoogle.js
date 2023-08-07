require("dotenv").config();
var GoogleStrategy = require('passport-google-oauth2').Strategy;

exports.initializedGoogle = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACKURL,
        passReqToCallback: true
    },
        function (request, accessToken, refreshToken, profile, done) {
            console.log(profile);
            return done(null, profile);
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    })
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

};

exports.authenticateGoogle = ((req, res, next) => {
    if (req.user) next();
    else
        return false;
})


