const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/booksController.Js");

router.get("/", booksCtrl.getAllBooks);

router.get("/bestrating", booksCtrl.getBestRating);

router.get("/:id", booksCtrl.getBookById);

module.exports = router;
