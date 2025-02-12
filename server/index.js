import express from "express";
import "dotenv/config";
import cors from "cors";
import fridgeRoutes from "./routes/fridgeRoutes.js";
// import recipesRoutes from "./routes/recipesRoutes.js";
// import mealPlanRoutes from "./routes/mealPlanRoutes.js";
// import groceryListRoutes from "./routes/groceryListRoutes.js";
// import favoriteRecipesRoutes from "./routes/favoriteRecipesRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url, req.body);
  next();
});

app.use("/api/fridge", fridgeRoutes);
// app.use("/api/recipes", recipesRoutes);
// app.use("/api/meal-plan", mealPlanRoutes);
// app.use("/api/grocery-list", groceryListRoutes);
// app.use("/api/favorites", favoriteRecipesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
