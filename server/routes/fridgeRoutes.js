import express from "express";
import * as fridgeController from "../controllers/fridgeController.js";

const router = express.Router();

router
  .route("/")
  .get(fridgeController.getAllFridgeItems)
  .post(fridgeController.addFridgeItem);

router
  .route("/:id")
  .get(fridgeController.getFridgeItem)
  .put(fridgeController.updateFridgeItem)
  .delete(fridgeController.deleteFridgeItem);

export default router;
