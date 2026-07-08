const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logger = require("../middleware/logger");

const shelterPetController = {

  getShelterPets: async (req, res) => {
    try {
      const userShelters = await prisma.shelter.findMany({
        where: { owner_user_id: req.user.userId }
      });

      if (userShelters.length === 0) {
        return res.status(200).json([]);
      }

      const shelterIds = userShelters.map(s => s.id);

      const pets = await prisma.pet.findMany({
        where: {
          shelter_id: { in: shelterIds }
        }
      });

      res.status(200).json(pets);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  createPet: async (req, res) => {
    const { name, species, breed, age, description } = req.body;

    try {
      const userShelters = await prisma.shelter.findMany({
        where: { owner_user_id: req.user.userId }
      });

      if (userShelters.length === 0) {
        return res.status(403).json({ error: "You don't own any shelters" });
      }

      const shelter_id = userShelters[0].id;
      const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

      const newPet = await prisma.pet.create({
        data: {
          name,
          species,
          breed,
          age: age ? Number(age) : null,
          description,
          photo_url,
          shelter_id,
          status: "available"
        }
      });

      res.status(201).json({ message: "Pet created successfully", pet: newPet });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  updatePet: async (req, res) => {
    const { petId } = req.params;
    const { name, species, breed, age, description, status } = req.body;

    try {
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
        include: { shelter: true }
      });

      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      if (pet.shelter.owner_user_id !== req.user.userId) {
        return res.status(403).json({ error: "You don't own this pet" });
      }

      const updatedPet = await prisma.pet.update({
        where: { id: petId },
        data: {
          name,
          species,
          breed,
          age: age ? Number(age) : null,
          description,
          status
        }
      });

      res.status(200).json({ message: "Pet updated", pet: updatedPet });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = shelterPetController;