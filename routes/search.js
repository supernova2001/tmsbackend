import express from "express";
import { searchPlace } from "../controllers/searchController.js";

const search = express.Router();

search.get("/autocomplete", searchPlace);

export default search;
