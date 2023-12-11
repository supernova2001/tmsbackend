import express from "express";
import { getReviewsAccommodation } from "../controllers/getReviewsAccommodation.js";
const reviewRouter = express.Router();
reviewRouter.get("/uid_user", getReviewsAccommodation);
export default reviewRouter;
