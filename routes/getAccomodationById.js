import express from "express";
import { getAccommodationById } from "../controllers/accommodationById.js";
const accIDRouter = express.Router();
accIDRouter.get("/id", getAccommodationById);
export default accIDRouter;
