const express = require("express");
const feedController = require("../controllers/feedController");
const { authMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();


router.get("/", feedController.getFeed);


router.post("/", authMiddleware, upload.single('photo'), feedController.createPost);


router.post("/:postId/reactions", authMiddleware, feedController.addReaction);


router.post("/:postId/report", authMiddleware, feedController.reportPost);

module.exports = router;