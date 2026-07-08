const express = require("express");
const shelterController = require ("../controllers/shelterController");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.patch("/shelters/:id/verify", authMiddleware, requireRole("admin"), shelterController.verify);

module.exports = router;