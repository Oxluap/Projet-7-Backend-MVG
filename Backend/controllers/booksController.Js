const Book = require("../models/Book");

exports.getAllBooks = (req, res) => {
  Book.find({})
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "An error occurred" });
    });
};

exports.getBestRating = async (req, res) => {
  try {
    const books = await Book.find().sort({ rating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.getBookById = (req, res) => {
  const id = req.params.id;

  Book.findById(id)
    .then((book) => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "an error occured" });
    });
};
