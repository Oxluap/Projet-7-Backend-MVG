const express = require("express");
const booksCtrl = require("../controllers/booksController");
const auth = require("../middleware/auth.js");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.get("/", booksCtrl.getAllBooks);

router.get("/bestrating", booksCtrl.getBestRating);

router.get("/:id", booksCtrl.getBookById);

router.post("/", auth, multer, booksCtrl.addBook);

router.put("/:id", auth, multer, booksCtrl.modifyBook);

router.delete("/:id", auth, booksCtrl.deleteBook);

router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
