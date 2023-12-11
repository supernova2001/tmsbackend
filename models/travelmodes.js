import { Double } from "mongodb";
import mongoose from "mongoose";

const travelmodeSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: true,
  },
  to_place: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fare: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vehicle_number: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
});

export default mongoose.model("travelmodes", travelmodeSchema);
