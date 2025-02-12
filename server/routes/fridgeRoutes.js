import express from "express";
import {
  getFridgeItems,
  addFridgeItem,
  updateFridgeItem,
  deleteFridgeItem,
} from "../controllers/fridgeController";

const router = express.Router();

router.get("/", getFridgeItems);
router.post("/", addFridgeItem);
router.put("/:id", updateFridgeItem);
router.delete("/:id", deleteFridgeItem);

export default router;
