const express = require("express");
const petController = require("../controllers/petController");
const validate = require("../middleware/validate");
const { petSchema } = require("../validators/petValidator");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();


router.get("/", petController.getAll);
router.get("/:id", petController.getById);

router.patch("/:id", authMiddleware, requireRole("shelter_staff"), validate(petSchema), petController.update);

module.exports = router;