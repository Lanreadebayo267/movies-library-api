const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/review");

const router = express.Router();


// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET review by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// CREATE review
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});


// UPDATE review
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
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
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
    }

    const deletedReview =
      await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json({
      message: "Review deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;