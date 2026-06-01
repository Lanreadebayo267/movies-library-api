const express = require("express");
const mongoose = require("mongoose");
const ensureAuth = require("../middleware/authenticate");

const router = express.Router();

// Review Schema
const reviewSchema = new mongoose.Schema({
  movieTitle: {
    type: String,
    required: true,
    trim: true
  },
  reviewer: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  }
});

const Review =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// POST review
router.post("/", ensureAuth, async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// GET review by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
    }

    const review =
      await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// PUT review
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
    }

    const updatedReview =
      await Review.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE review
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
    }

    const deletedReview =
      await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json({
      message:
        "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;