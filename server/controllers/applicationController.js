const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const applicationController = {
  create: async (req, res) => {
    const { petId } = req.params;
    const { message } = req.body;
    try {
      const pet = await prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      const application = await prisma.application.create({
        data: { pet_id: petId, adopter_id: req.user.userId, message },
      });
      res.status(201).json({ message: "Application submitted", application });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getMine: async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        where: { adopter_id: req.user.userId },
        include: { pet: true },
      });
      res.status(200).json({ applications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getForShelter: async (req, res) => {
    const { shelterId } = req.params;
    try {
      const shelter = await prisma.shelter.findUnique({ where: { id: shelterId } });
      if (!shelter) {
        return res.status(404).json({ message: "Shelter not found" });
      }
      if (shelter.owner_user_id !== req.user.userId) {
        return res.status(403).json({ message: "You do not own this shelter" });
      }
      const applications = await prisma.application.findMany({
        where: { pet: { shelter_id: shelterId } },
        include: { pet: true },
      });
      res.status(200).json({ applications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const application = await prisma.application.findUnique({
        where: { id },
        include: { pet: { include: { shelter: true } } },
      });
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.pet.shelter.owner_user_id !== req.user.userId) {
        return res.status(403).json({ message: "You do not own this shelter" });
      }

      if (status === "approved") {
       
        const result = await prisma.$transaction([
          prisma.application.update({
            where: { id },
            data: { status: "approved" },
          }),
          prisma.application.updateMany({
            where: {
              pet_id: application.pet_id,
              id: { not: id },
              status: "submitted",
            },
            data: { status: "rejected" },
          }),
          prisma.pet.update({
            where: { id: application.pet_id },
            data: { status: "pending" },
          }),
        ]);
        return res.status(200).json({ message: "Application approved, pet marked pending", result });
      }

      if (status === "adopted") {
        const result = await prisma.$transaction([
          prisma.application.update({
            where: { id },
            data: { status: "adopted" },
          }),
          prisma.pet.update({
            where: { id: application.pet_id },
            data: { status: "adopted" },
          }),
        ]);
        return res.status(200).json({ message: "Application finalized, pet marked adopted", result });
      }

      const updated = await prisma.application.update({
        where: { id },
        data: { status },
      });
      res.status(200).json({ message: "Application status updated", application: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = applicationController;