const pool = require('../config/db.js');

const passport=require("passport") ;
const { Strategy:GoogleStrategy }=require("passport-google-oauth20");
const dotenv= require("dotenv");
const { findUserByGoogleId, createUser }=require("../models/userModel.js");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await findUserByGoogleId(googleId);
        if (!user) {
          user = await createUser(googleId, email, name);
        }
        return done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

// serialize user → store user id in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user → find user by id
passport.deserializeUser(async (id, done) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  done(null, result.rows[0]);
});

module.exports = passport;
