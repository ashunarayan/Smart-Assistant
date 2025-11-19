const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // If request is JSON (API call), return 401 error
  if (req.headers['content-type'] === 'application/json') {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }
  res.redirect('/auth/google');
};

module.exports = ensureAuthenticated;