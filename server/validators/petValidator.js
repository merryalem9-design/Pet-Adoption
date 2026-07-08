const zod = require("zod");

const petSchema = zod.object({
  name: zod.string().min(1, { message: "Name is required" }),
  species: zod.string().min(1, { message: "Species is required" }),
  breed: zod.string().optional(),
  age: zod.union([zod.string(), zod.number()]).optional(),
  description: zod.string().optional(),
});

module.exports = { petSchema };