const express= require("express");
const shelterController = require("../controllers/shelterController");
const validate = require("../middleware/validate");
const { shelterSchema } = require("../validators/shelterValidator");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, requireRole("shelter_staff"), validate(shelterSchema), shelterController.create);
module.exports = router;