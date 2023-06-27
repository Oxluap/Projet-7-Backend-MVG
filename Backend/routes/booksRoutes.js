const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/booksController.Js");

//Book acceuil//

router.get("/", booksCtrl.getAllBooks);

//Best rating book//

router.get("/bestrating", booksCtrl.getBestRating);

//Book page by id//

router.get("/:id", booksCtrl.getBookById);

module.exports = router;
