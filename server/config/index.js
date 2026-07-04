require('dotenv').config();
/*console.log('Database_URL:',process.env.DATABASE_URL);
console.log('PORT:',process.env.PORT);
console.log('JWT_SECRET:',process.env.JWT_SECRET);*/
module.exports={
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
}

