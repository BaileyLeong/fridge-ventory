import express from "express";
import * as mealPlanController from "../controllers/mealPlanController.js";
import requireUserId from "../middleware/requireUserId.js";

const router = express.Router();

router.use(requireUserId);
router
  .route("/")
  .get(mealPlanController.getMealPlan)
  .post(mealPlanController.addMealToPlan);

router
  .route("/:id")
  .get(mealPlanController.getMealById)
  .put(mealPlanController.updateMealInPlan)
  .delete(mealPlanController.deleteMealFromPlan);

export default router;
