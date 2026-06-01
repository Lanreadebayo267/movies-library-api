const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    message: "You must log in first"
  });
};

module.exports = ensureAuth;