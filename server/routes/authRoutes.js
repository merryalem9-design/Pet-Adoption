const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/authValidator");

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
