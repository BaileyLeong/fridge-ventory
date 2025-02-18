import express from "express";
import * as recipesController from "../controllers/recipesController.js";

const router = express.Router();

router.use(requireUserId);
router.route("/suggest").get(recipesController.suggestRecipes);
router
  .route("/")
  .get(recipesController.getAllRecipes)
  .post(recipesController.addRecipe);
router.route("/:id").get(recipesController.getRecipeById);

export default router;
