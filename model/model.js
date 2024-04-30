import mongoose from "mongoose";

const VanmateMode = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Phone: { type: Number, required: true },
  Password: { type: String, required: true },
});

const modelEx = mongoose.model("/Android App", VanmateMode);

export default modelEx;
