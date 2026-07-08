const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const feedController = {
 
  getFeed: async (req, res) => {
    const { page = 1 } = req.query;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    try {
      const posts = await prisma.updatePost.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include: {
          adopter: { select: { id: true, displayName: true } },
          _count: { select: { reactions: true } }
        }
      });

      res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  
  createPost: async (req, res) => {
    const { caption, milestone_label, application_id } = req.body;
    try {
      
      const application = await prisma.application.findUnique({
        where: { id: application_id },
        include: { pet: true }
      });

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.adopter_id !== req.user.userId) {
        return res.status(403).json({ error: "Not your application" });
      }

      if (application.status !== "adopted") {
        return res.status(400).json({ error: "Application not in adopted status" });
      }

      const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

      const post = await prisma.updatePost.create({
        data: {
          caption,
          milestone_label: milestone_label || 'other',
          photo_url,
          application_id,
          adopter_id: req.user.userId,
          pet_id: application.pet_id
        },
        include: {
          adopter: { select: { id: true, displayName: true } },
          _count: { select: { reactions: true } }
        }
      });

      res.status(201).json({ message: "Post created", post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  addReaction: async (req, res) => {
    const { postId } = req.params;
    const { type } = req.body;

    try {
      const post = await prisma.updatePost.findUnique({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      
      const existingReaction = await prisma.reaction.findFirst({
        where: {
          post_id: postId,
          user_id: req.user.userId
        }
      });

      if (existingReaction) {
       
        const updated = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type }
        });
        return res.status(200).json({ message: "Reaction updated", reaction: updated });
      }

      
      const reaction = await prisma.reaction.create({
        data: {
          post_id: postId,
          user_id: req.user.userId,
          type
        }
      });

      res.status(201).json({ message: "Reaction added", reaction });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

 
  reportPost: async (req, res) => {
    const { postId } = req.params;
    const { reason } = req.body;

    try {
      const post = await prisma.updatePost.findUnique({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const report = await prisma.report.create({
        data: {
          post_id: postId,
          reporter_id: req.user.userId,
          reason
        }
      });

      res.status(201).json({ message: "Post reported", report });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = feedController;