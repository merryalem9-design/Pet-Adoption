const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const shelterController = {
  create: async (req, res) => {
    const { name, description, address } = req.body;
    try {
      const newShelter = await prisma.shelter.create({
        data: { name, description, address, owner_user_id: req.user.userId },
      });
      res.status(201).json({ message: "Shelter created successfully", shelter: newShelter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
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
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = shelterController;