const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const favoriteController = {
  add: async (req, res) => {
    const { petId } = req.params;
    try {
      const favorite = await prisma.favorite.create({
        data: { user_id: req.user.userId, pet_id: petId },
      });
      res.status(201).json({ message: "Pet favorited", favorite });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Already favorited" });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  remove: async (req, res) => {
    const { petId } = req.params;
    try {
      await prisma.favorite.delete({
        where: { user_id_pet_id: { user_id: req.user.userId, pet_id: petId } },
      });
      res.status(200).json({ message: "Favorite removed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = favoriteController;