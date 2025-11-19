const express = require('express');
const passport = require('../passport/passport.js');
const router = express.Router();

// Initiate Google OAuth
router.get("/google",
  passport.authenticate("google", { 
    // Request Gmail permissions + standard profile data
    scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.send"], 
    accessType: 'offline', // CRITICAL: Required to get the Refresh Token
    prompt: 'consent'      // Forces Google to give a new refresh token every time (good for dev)
  })
);
// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/dashboard",
  })
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.send("Error logging out");
    res.redirect("/");
  });
});

module.exports = router;
