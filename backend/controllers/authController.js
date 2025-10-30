const dashboard = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.send(`Welcome ${req.user.name}`);
};

module.exports = { dashboard };
