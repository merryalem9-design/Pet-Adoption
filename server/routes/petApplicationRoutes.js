const express = require("express");
const applicationController = require("../controllers/applicationController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, requireRole("adopter"), applicationController.create);

module.exports = router;