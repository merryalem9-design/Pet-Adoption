const express = require("express");
const petController = require("../controllers/petController");
const validate = require("../middleware/validate");
const { petSchema } = require("../validators/petValidator");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, requireRole("shelter_staff"), validate(petSchema), petController.create);

module.exports = router;