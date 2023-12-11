import express from "express";
import { getUserItinerary, sendItineraryEmail } from "../controllers/userItinerary.js";

const router = express.Router();

router.get("/getUserItinerary", getUserItinerary);
router.post("/sendItineraryEmail", sendItineraryEmail);

export default router;