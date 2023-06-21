const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { type: String, require: true },
  grade: { type: Number, require: true },
});

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  ratings: [ratingSchema],
  averageRating: { type: Number },
});
