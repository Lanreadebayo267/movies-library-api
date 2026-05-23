const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie
} = require("../controllers/movies");

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);
    
module.exports = router;