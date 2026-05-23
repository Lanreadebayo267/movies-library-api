const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");

const { connectDB } = require("./db/connect");
const movieRoutes = require("./routes/movies");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/movies", movieRoutes);

// Swagger (OPENAPI 3 - FIXED BODY SUPPORT)
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Movie Library API",
    version: "1.0.0",
    description: "CRUD API for managing movies"
  },
  servers: [
    {
      url: `http://localhost:${PORT}`
    }
  ],
  paths: {
  "/movies": {
    get: {
      summary: "Get all movies",
      responses: {
        200: { description: "Success" }
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
                streamingPlatform: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Created" }
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
          schema: { type: "string" }
        }
      ],
      responses: {
        200: { description: "Success" },
        404: { description: "Not found" }
      }
    },

    put: {
      summary: "Update movie",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
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
                streamingPlatform: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Updated" },
        404: { description: "Not found" }
      }
    },

    delete: {
      summary: "Delete movie",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: { description: "Deleted" },
        404: { description: "Not found" }
      }
    }
  }
}
};

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Movie Library API is running"
  });
});

// Start server AFTER DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
});