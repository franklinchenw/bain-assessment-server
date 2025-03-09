import { Router } from "express";
import { GeocodingController } from "../controllers/geocoding.controller";

const router = Router();
const geocodingController = new GeocodingController();

router.post("/distance", geocodingController.calculateDistance);
router.get("/history", geocodingController.getDistanceHistory);

export default router;
