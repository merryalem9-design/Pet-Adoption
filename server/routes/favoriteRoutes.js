const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();


router.post("/:petId", authMiddleware, requireRole("adopter"), favoriteController.create);


router.get("/mine", authMiddleware, requireRole("adopter"), favoriteController.getMine);


router.delete("/:favoriteId", authMiddleware, favoriteController.delete);

module.exports = router;