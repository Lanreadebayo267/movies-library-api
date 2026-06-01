const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const session = require("express-session");

const passport = require("./auth/passport");
const { connectDB } = require("./db/connect");

const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");

const swaggerDocument = require("./swagger.json");

const app = express();
const PORT = process.env.PORT || 8080;

// ======================
// Middleware
// ======================
app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://movies-library-api-1.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ======================
// Swagger Docs
// ======================
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

// ======================
// API Routes
// ======================
app.use("/movies", movieRoutes);
app.use("/reviews", reviewRoutes);

// ======================
// Home Route
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Movie Library API is running"
  });
});

// ======================
// OAuth Routes
// ======================
// Check login status
app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: req.user
    });
  }

  res.status(401).json({
    authenticated: false
  });
});

// Login with GitHub
app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"]
  })
);

// GitHub callback
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
    session: true
  }),
  (req, res) => {
    res.redirect("/auth/status");
  }
);

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// ======================
// Start Server
// ======================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(
      "Database connection failed:",
      err.message
    );
    process.exit(1);
  });