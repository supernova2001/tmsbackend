import express from "express";
import { placename } from "../controllers/placeController.js";

const placeRouter = express.Router();

placeRouter.get("/placename", placename);

export default placeRouter;
