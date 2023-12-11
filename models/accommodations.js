import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stars: {
    type: Number,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longtitude: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
  },
  reviews: {
    type: [String],
  },
});

export default mongoose.model("accommodations", accommodationSchema);
