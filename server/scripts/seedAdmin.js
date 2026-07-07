const PrismaClient = require('@prisma/client').PrismaClient;
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedAdmin() {
  const email = 'Merry@gmail.com';
  const name = 'Merry';
  const saltRounds = 10;
  const password_hash = await bcrypt.hash("Merry123", saltRounds);
  
  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
   const newAdmin = await prisma.user.create({
    data: {
      email,
      name,
      password_hash,
      role: 'admin',
    },
  });
  console.log('Admin user created:', newAdmin);
} catch (error) {
  console.error('Error creating admin user:', error);
}}
seedAdmin().finally(() => prisma.$disconnect());
