


import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  customId: {
    type: String,
    required: [true, "El customId es obligatorio"],
    unique: true,
    trim: true,
    default: () => `PROD-${Date.now()}`,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
})

export default mongoose.model("Product", productSchema)

