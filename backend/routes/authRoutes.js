const express = require('express');
const passport = require('../passport/passport.js');
const router = express.Router();

// Initiate Google OAuth
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
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
