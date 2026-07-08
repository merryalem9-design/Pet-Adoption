const express = require("express");
const applicationController = require("../controllers/applicationController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

// Create application
router.post("/", authMiddleware, requireRole("adopter"), applicationController.create);

// Get my applications
router.get("/mine", authMiddleware, requireRole("adopter"), applicationController.getMine);

// Get shelter applications
router.get("/shelter", authMiddleware, requireRole("shelter_staff"), applicationController.getShelterApplications);

// Update application status
router.patch("/:id/status", authMiddleware, requireRole("shelter_staff"), applicationController.updateStatus);

module.exports = router;