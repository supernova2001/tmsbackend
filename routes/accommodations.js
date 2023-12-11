import express from "express";

import { accommodation } from "../controllers/accommodationController.js";

const accRouter = express.Router();
accRouter.get("/place", accommodation);
export default accRouter;
