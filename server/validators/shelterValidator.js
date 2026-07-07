const zod = require("zod");
const shelterSchema = zod.object({
  name: zod.string().min(1, {message: "Name is required"}),
  description: zod.string().optional(),
  address: zod.string().min(1, {message: "Address is required"})
});
module.exports = { shelterSchema };