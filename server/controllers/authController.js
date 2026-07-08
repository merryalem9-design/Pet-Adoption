const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ALLOWED_ROLES = ["adopter", "shelter_staff"];

const authController = {
  register: async (req, res) => {
    const { email, displayName, password, role } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const finalRole = ALLOWED_ROLES.includes(role) ? role : "adopter";
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const newUser = await prisma.user.create({
        data: { email, name: displayName, password_hash, role: finalRole },
      });

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, displayName: newUser.name, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser.id, email: newUser.email, displayName: newUser.name, role: newUser.role },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, displayName: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        message: "Login successful",
        user: { id: user.id, email: user.email, displayName: user.name, role: user.role },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = authController;