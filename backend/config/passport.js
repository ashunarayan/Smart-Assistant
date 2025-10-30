const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Map profile to user record
    const user = await userService.findOrCreateFromGoogle(profile);
    // `done(null, user)` will be handled in controller to issue JWT
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// passport serialization not required unless using sessions
module.exports = passport;