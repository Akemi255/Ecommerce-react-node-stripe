const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", userController.getProfile);
router.delete("/deleteAccount", userController.deleteAccount);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/changePassword", userController.changePassword);
module.exports = router;
