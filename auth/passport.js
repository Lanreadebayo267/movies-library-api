const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/github/callback"
    },

    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Save user session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Read user session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;