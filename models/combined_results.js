import mongoose from "mongoose";

const combinedResultsSchema = new mongoose.Schema({
  uid_user: { type: String, required: true },
  accomodation: [{ type: Object }],
  travel: [{ type: Object }],
  comments: { type: Array, default: [] },
});

const CombinedResults = mongoose.model(
  "CombinedResults",
  combinedResultsSchema
);

export default CombinedResults;
