const express= require("express");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
env.config();

const ALLOWED_ROLES = ["adopter", "shelter_staff"];

const authController = {
  register: async(req, res) => {
    const { email, name, password, role} = req.body;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const finalRole = ALLOWED_ROLES.includes(role) ? role : "adopter";
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const newUser = await prisma.user.create({
        data: { email, name, password_hash, role: finalRole },
      });

     const  token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      
    const { password_hash: _, ...safeUser } = newUser;
  res.status(201).json({ message: "User registered successfully", user: safeUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
