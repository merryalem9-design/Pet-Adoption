const express = require("express");
const applicationController = require("../controllers/applicationController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, requireRole("shelter_staff"), applicationController.getForShelter);

module.exports = router;