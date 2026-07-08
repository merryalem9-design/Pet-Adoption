const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const petController = {
  getAll: async (req, res) => {
    const { species, breed, status } = req.query;
    try {
      const filters = {};
      if (species) filters.species = species;
      if (breed) filters.breed = breed;
      if (status) filters.status = status;

      const pets = await prisma.pet.findMany({ where: filters });
      res.status(200).json({ pets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const pet = await prisma.pet.findUnique({ where: { id } });
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.status(200).json({ pet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

create: async (req, res) => {
    const { name, species, breed, age, description } = req.body;
    const { shelterId } = req.params;
    try {
      const shelter = await prisma.shelter.findUnique({ where: { id: shelterId } });
      if (!shelter) {
        return res.status(404).json({ message: "Shelter not found" });
      }
      if (shelter.owner_user_id !== req.user.userId) {
        return res.status(403).json({ message: "You do not own this shelter" });
      }
      const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
      const newPet = await prisma.pet.create({
        data: { name, species, breed, age: age ? Number(age) : null, description, shelter_id: shelterId, photo_url },
      });
      res.status(201).json({ message: "Pet created successfully", pet: newPet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { name, species, breed, age, description, status } = req.body;
    try {
      const pet = await prisma.pet.findUnique({ where: { id }, include: { shelter: true } });
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      if (pet.shelter.owner_user_id !== req.user.userId) {
        return res.status(403).json({ message: "You do not own this pet's shelter" });
      }
      const updatedPet = await prisma.pet.update({
        where: { id },
        data: { name, species, breed, age: age ? Number(age) : null, description, status },
      });
      res.status(200).json({ message: "Pet updated successfully", pet: updatedPet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = petController;