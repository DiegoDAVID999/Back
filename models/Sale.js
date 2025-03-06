


// import mongoose from "mongoose"
// import moment from "moment-timezone"




// const saleSchema = new mongoose.Schema({
//   products: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       customId: { type: String, required: true },
//       name: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   total: { type: Number, required: true },
//   date: { 
//     type: Date, 
//     default: () => moment().tz("America/Bogota").toDate() 
//   },
// })

// export default mongoose.model("Sale", saleSchema)

import mongoose from "mongoose";
import moment from "moment-timezone";

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
  paymentMethod: { type: String, required: true },  // Aquí agregamos el método de pago
  date: {
    type: Date,
    default: () => moment().tz("America/Bogota").toDate(),
  },
});

saleSchema.index({ date: 1 })


export default mongoose.model("Sale", saleSchema);
