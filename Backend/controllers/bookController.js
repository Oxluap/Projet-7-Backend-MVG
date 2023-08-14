const Book = require(path.resolve(__dirname, "..", "models", "Book.js"));
const fs = require("fs");

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
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
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

exports.addBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Mise à jour réussi !" }))
          .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre supprimé" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (
      book.ratings.some(
        (rating) => rating.userId.toString() === req.body.userId
      )
    ) {
      return res
        .status(400)
        .json({ message: "User has already rated this book" });
    }

    const userRating = parseInt(req.body.rating, 10);
    if (userRating < 0 || userRating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    book.ratings.push({ userId: req.body.userId, grade: userRating });

    const totalRating = book.ratings.reduce(
      (sum, rating) => sum + rating.grade,
      0
    );
    book.averageRating = totalRating / book.ratings.length;

    await book.save();

    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
