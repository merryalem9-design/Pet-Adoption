const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/:petId", authMiddleware, requireRole("adopter"), favoriteController.add);
router.delete("/:petId", authMiddleware, requireRole("adopter"), favoriteController.remove);

module.exports = router;