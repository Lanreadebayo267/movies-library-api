const Joi = require("joi");

const movieSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required(),
  genre: Joi.string().required(),
  releaseYear: Joi.number().required(),
  rating: Joi.number().min(1).max(10).required(),
  duration: Joi.number().required(),
  language: Joi.string().required(),
  streamingPlatform: Joi.string().required()
});

module.exports = movieSchema;