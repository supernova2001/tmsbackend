import CombinedResults from "../models/combined_results.js";
export const getReviewsAccommodation = async (req, res) => {
  const uid_user = req.query.uid_user;
  console.log(uid_user, "User_id");
  try {
    const aID = await CombinedResults.find({ uid_user });
    res.json(aID[0].comments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "No review found" });
  }
};
