import express from "express";
import * as recipesController from "../controllers/recipesController.js";

const router = express.Router();

router.route("/").get(recipesController.getAllRecipes);
router.route("/:id").get(recipesController.getRecipeById);
router.route("/suggest").get(recipesController.suggestRecipes);

export default router;
