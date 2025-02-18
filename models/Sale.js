


import mongoose from "mongoose"

const saleSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      customId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

export default mongoose.model("Sale", saleSchema)

