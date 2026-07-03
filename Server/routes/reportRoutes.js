import express from "express";
import { analyzeWebsite } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Website Analysis Route
router.post("/get-url", protect, analyzeWebsite);

export default router;