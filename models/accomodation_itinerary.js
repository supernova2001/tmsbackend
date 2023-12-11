import mongoose from "mongoose";

const accommodation_itinerarySchema = new mongoose.Schema({
  checkin_date: { type: String, required: true },
  checkout_date: { type: String, required: true },
  num_travelers: { type: Number, required: true },
  uid_accomodation: { type: String, required: true },
  uid_user: { type: String, required: true },
});

export default mongoose.model(
  "accomodation_itinerary",
  accommodation_itinerarySchema
);
