import express from "express";
import * as groceryListController from "../controllers/groceryListController.js";

const router = express.Router();

router.route("/").get(groceryListController.getGroceryList);
router.route("/add").post(groceryListController.addItemToGroceryList);
router
  .route("/remove/:id")
  .delete(groceryListController.removeItemFromGroceryList);
router.route("/update/:id").patch(groceryListController.groceryItemComplete);

export default router;
