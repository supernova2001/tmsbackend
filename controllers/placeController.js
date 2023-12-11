import places from "../models/places.js";

export const placename = async (req, res) => {
  const inputplace = req.query.p;
  let query = null;
  if (inputplace) {
    const regex = new RegExp(`^${inputplace}`, "i");
    query = { place_name: regex };
  }

  try {
    const results = await places.find(query);
    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
