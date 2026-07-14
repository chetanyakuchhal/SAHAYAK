import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  amount: { type: String, required: true },
  fundraiser: { type: String, required: true },
  fundraiserId: { type: String },
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  status: { type: String, required: true, default: "Success" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
