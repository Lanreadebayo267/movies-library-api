const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");

const { connectDB } = require("./db/connect");
const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://movies-library-api-1.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/movies", movieRoutes);
app.use("/reviews", reviewRoutes);

// Swagger OpenAPI 3
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Movie Library API",
    version: "1.0.0",
    description: "CRUD API for managing movies and reviews"
  },

  servers: [
    {
      url: "https://movies-library-api-1.onrender.com",
      description: "Production Server"
    },
    {
      url: "http://localhost:8080",
      description: "Local Server"
    }
  ],

  paths: {
    "/movies": {
      get: {
        summary: "Get all movies",
        responses: {
          200: {
            description: "Success"
          }
        }
      },

      post: {
        summary: "Create a movie",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  director: { type: "string" },
                  genre: { type: "string" },
                  releaseYear: { type: "number" },
                  rating: { type: "number" },
                  duration: { type: "number" },
                  language: { type: "string" },
                  streamingPlatform: {
                    type: "string"
                  }
                }
              }
            }
          }
        },

        responses: {
          201: {
            description: "Movie created"
          },
          400: {
            description: "Bad Request"
          }
        }
      }
    },

    "/movies/{id}": {
      get: {
        summary: "Get movie by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Success"
          },
          404: {
            description: "Movie not found"
          }
        }
      },

      put: {
        summary: "Update movie",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  director: { type: "string" },
                  genre: { type: "string" },
                  releaseYear: { type: "number" },
                  rating: { type: "number" },
                  duration: { type: "number" },
                  language: { type: "string" },
                  streamingPlatform: {
                    type: "string"
                  }
                }
              }
            }
          }
        },

        responses: {
          200: {
            description: "Movie updated"
          },
          404: {
            description: "Movie not found"
          }
        }
      },

      delete: {
        summary: "Delete movie",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Movie deleted"
          },
          404: {
            description: "Movie not found"
          }
        }
      }
    },

    "/reviews": {
      get: {
        summary: "Get all reviews",
        responses: {
          200: {
            description: "Success"
          }
        }
      },

      post: {
        summary: "Create a review",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  movieTitle: {
                    type: "string"
                  },
                  reviewer: {
                    type: "string"
                  },
                  comment: {
                    type: "string"
                  },
                  rating: {
                    type: "number"
                  }
                }
              }
            }
          }
        },

        responses: {
          201: {
            description: "Review created"
          },
          400: {
            description: "Bad Request"
          }
        }
      }
    },

    "/reviews/{id}": {
      get: {
        summary: "Get review by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Success"
          },
          404: {
            description: "Review not found"
          }
        }
      },

      put: {
        summary: "Update review",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  movieTitle: {
                    type: "string"
                  },
                  reviewer: {
                    type: "string"
                  },
                  comment: {
                    type: "string"
                  },
                  rating: {
                    type: "number"
                  }
                }
              }
            }
          }
        },

        responses: {
          200: {
            description: "Review updated"
          },
          404: {
            description: "Review not found"
          }
        }
      },

      delete: {
        summary: "Delete review",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Review deleted"
          },
          404: {
            description: "Review not found"
          }
        }
      }
    }
  }
};

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Movie Library API is running"
  });
});

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(
      "❌ DB connection failed:",
      err.message
    );
    process.exit(1);
  });