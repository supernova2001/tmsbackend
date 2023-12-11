import accomodations from "../models/accommodations.js";

export const accommodation = async (req, res) => {
  const input = req.query.city;
  const regex = new RegExp(`^${input}`, "i");

  try {
    const results = await accomodations.find({ city: regex });
    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

