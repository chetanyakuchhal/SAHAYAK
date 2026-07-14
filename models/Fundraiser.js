import mongoose from "mongoose";

const FundraiserSchema = new mongoose.Schema({
  title: String,
  description: String,
  amountNeeded: Number,
  amountRaised: Number,
  coverImage: String,
  documentName: String,
  createdByUserId: String,
  createdByEmail: String,
  createdByName: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Fundraiser || mongoose.model("Fundraiser", FundraiserSchema);
