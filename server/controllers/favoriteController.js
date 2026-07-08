const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const favoriteController = {
  create: async (req, res) => {
    const { petId } = req.params;
    try {
      const pet = await prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      // Check if already favorited
      const existing = await prisma.favorite.findFirst({
        where: { 
          pet_id: petId,
          user_id: req.user.userId
        }
      });

      if (existing) {
        return res.status(400).json({ error: "Already in favorites" });
      }

      const favorite = await prisma.favorite.create({
        data: { 
          pet_id: petId,
          user_id: req.user.userId
        },
        include: { pet: true }
      });
      res.status(201).json({ message: "Added to favorites", favorite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getMine: async (req, res) => {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { user_id: req.user.userId },
        include: { pet: true },
      });
      res.status(200).json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  delete: async (req, res) => {
    const { favoriteId } = req.params;
    try {
      const favorite = await prisma.favorite.findUnique({ where: { id: favoriteId } });
      if (!favorite) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      if (favorite.user_id !== req.user.userId) {
        return res.status(403).json({ error: "Not your favorite" });
      }

      await prisma.favorite.delete({ where: { id: favoriteId } });
      res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = favoriteController;