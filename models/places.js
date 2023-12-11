import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  place_name: String,
});

export default mongoose.model("places", placeSchema);
