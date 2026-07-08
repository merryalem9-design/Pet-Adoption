const express = require("express");
const applicationController = require("../controllers/applicationController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/mine", authMiddleware, requireRole("adopter"), applicationController.getMine);
router.patch("/:id/status", authMiddleware, requireRole("shelter_staff"), applicationController.updateStatus);

module.exports = router;