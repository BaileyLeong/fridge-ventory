import express from "express";
import * as favoriteRecipesController from "../controllers/favoriteRecipesController.js";
import requireUserId from "../middleware/requireUserId.js";

const router = express.Router();

router.use(requireUserId);

router
  .route("/")
  .get(favoriteRecipesController.getFavoriteRecipes)
  .post(favoriteRecipesController.addFavoriteRecipe);

router.route("/:id").delete(favoriteRecipesController.removeFavoriteRecipe);

export default router;
