import express from "express";
import { t_modes } from "../controllers/travelmodeController.js";

const travelmodeRouter = express.Router();

travelmodeRouter.get("/travelmode", t_modes);

export default travelmodeRouter;
