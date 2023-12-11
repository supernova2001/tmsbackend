import accommodations from "../models/accommodations.js";

export const getAccommodationById = async (req, res) => {
  const input = req.query.accommodationId;
  console.log(input, "accId");

  try {
    const aID = await accommodations.find({ _id: input });
    res.json(aID);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

