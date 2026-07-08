const express = require("express");
const shelterPetController = require("../controllers/shelterPetController");
const { authMiddleware, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();


router.get("/", authMiddleware, requireRole("shelter_staff"), shelterPetController.getShelterPets);


router.post("/", authMiddleware, requireRole("shelter_staff"), upload.single('photo'), shelterPetController.createPet);


router.patch("/:petId", authMiddleware, requireRole("shelter_staff"), upload.single('photo'), shelterPetController.updatePet);

module.exports = router;