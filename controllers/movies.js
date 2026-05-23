const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");
const movieSchema = require("../validation/movieValidation");

// GET all movies
const getAllMovies = async (req, res) => {
  try {
    const db = getDB();

    const movies = await db
      .collection("movies")
      .find()
      .toArray();

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// POST movie
const createMovie = async (req, res) => {
  try {
    const { error } = movieSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const db = getDB();

    const result = await db
      .collection("movies")
      .insertOne(req.body);

    res.status(201).json({
      message: "Movie created successfully",
      id: result.insertedId
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    const db = getDB();

    const movie = await db.collection("movies").findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json(movie);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const db = getDB();

    const result = await db.collection("movies").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json({
      message: "Movie updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const db = getDB();

    const result = await db.collection("movies").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json({
      message: "Movie deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie
};