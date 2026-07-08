const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const shelterController = {
  create: async (req, res) => {
    const { name, description, address } = req.body;
    try {
      const existing = await prisma.shelter.findFirst({
        where: { owner_user_id: req.user.userId },
      });
      if (existing) {
        return res.status(400).json({ error: "You already have a shelter" });
      }
      const newShelter = await prisma.shelter.create({
        data: { name, description, address, owner_user_id: req.user.userId },
      });
      res.status(201).json({ message: "Shelter created successfully", shelter: newShelter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getMine: async (req, res) => {
    try {
      const shelter = await prisma.shelter.findFirst({
        where: { owner_user_id: req.user.userId },
      });
      if (!shelter) {
        return res.status(404).json({ error: "No shelter found for this user" });
      }
      res.status(200).json(shelter);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const shelters = await prisma.shelter.findMany({
        include: { owner: { select: { name: true, email: true } } },
      });
      const mapped = shelters.map((s) => ({
        ...s,
        owner: { displayName: s.owner.name, email: s.owner.email },
      }));
      res.status(200).json(mapped);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  verify: async (req, res) => {
    const { id } = req.params;
    try {
      const shelter = await prisma.shelter.update({
        where: { id },
        data: { is_verified: true },
      });
      res.status(200).json({ message: "Shelter verified successfully", shelter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { name, description, address } = req.body;
    try {
      const shelter = await prisma.shelter.findUnique({ where: { id } });
      if (!shelter) {
        return res.status(404).json({ error: "Shelter not found" });
      }
      if (shelter.owner_user_id !== req.user.userId) {
        return res.status(403).json({ error: "You do not own this shelter" });
      }
      const updatedShelter = await prisma.shelter.update({
        where: { id },
        data: { name, description, address },
      });
      res.status(200).json({ message: "Shelter updated successfully", shelter: updatedShelter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = shelterController;