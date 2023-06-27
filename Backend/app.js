const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const booksRoutes = require("./routes/booksRoutes");

const uri =
  "mongodb+srv://Luap:Fe6FAejTmOYeO6WH@cluster0.fs6hkjc.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/api/books", booksRoutes);

module.exports = app;
