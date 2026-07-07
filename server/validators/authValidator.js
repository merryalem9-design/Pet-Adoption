const zod = require("zod");

const signupSchema =zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  name: zod.string().min(1, { message: "Name is required" }),
  password: zod.string().min(8, { message: "Password must be at least 8 characters long" }),
  role: zod.string().optional(),  
})

const loginSchema = zod.object({
  email: zod.string().email({ message:"Invalid email address"}),
  password: zod.string().min(8, { message: "Password must be atleast 8 characters long"})
})

module.exports = {signupSchema, loginSchema};