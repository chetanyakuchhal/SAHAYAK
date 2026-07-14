import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String },
  name: { type: String },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  gender: { type: String, default: "Not Selected" },
  birthday: { type: String, default: "Not Selected" },
  profilepic: { type: String },
  coverpic: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

if (models.User) {
  const existingSchema = models.User.schema;
  const missingFields = {
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    gender: { type: String, default: "Not Selected" },
    birthday: { type: String, default: "Not Selected" },
  };

  for (const [field, config] of Object.entries(missingFields)) {
    if (!existingSchema.path(field)) {
      existingSchema.add({ [field]: config });
    }
  }
}

// ✅ Prevent model overwrite issue
const User = models.User || model("User", UserSchema);

export default User;
