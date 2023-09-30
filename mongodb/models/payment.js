import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paidAt: {
    type: Date,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "productModel",
  },
  productModel: {
    type: String,
    required: true,
    enum: ["Service", "Event"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Validated", "Incorrect"],
    default: "Pending",
  },
});

const paymentModel = mongoose.model("Payment", PaymentSchema);

export default paymentModel;
