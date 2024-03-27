const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.delete("/remove-from-cart", cartController.removeFromCart);

module.exports = router;
