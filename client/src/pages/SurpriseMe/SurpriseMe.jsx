// import { useEffect, useState } from "react";
// import {
//   fetchSuggestedRecipes,
//   fetchRecipes,
//   fetchGroceryList,
//   addRecipe,
//   addMealToPlan,
//   addItemToGroceryList,
// } from "../../api/apiClient";
import "./SurpriseMe.scss";

const SurpriseMe = () => {
  // const [recipes, setRecipes] = useState([]);
  // const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  // const [groceryList, setGroceryList] = useState([]);
  // useEffect(() => {
  //   fetchSuggestedRecipes()
  //     .then((response) => {
  //       console.log("Fetched suggested recipes:", response.data);
  //       setRecipes(response.data || []);
  //     })
  //     .catch((error) => console.error("Error fetching recipes:", error));
  //   fetchGroceryList()
  //     .then((response) => setGroceryList(response.data || []))
  //     .catch((error) => console.error("Error fetching grocery list:", error));
  // }, []);
  // const handleAddToMealPlan = async () => {
  //   if (!recipes.length) {
  //     console.error("No recipes available");
  //     return;
  //   }
  //   const selectedRecipe = recipes[currentRecipeIndex];
  //   if (!selectedRecipe) {
  //     console.error("Selected recipe is undefined");
  //     return;
  //   }
  //   console.log("Adding recipe:", selectedRecipe);
  //   try {
  //     const response = await fetchRecipes();
  //     const allRecipes = response.data || [];
  //     const existingRecipe = allRecipes.find((r) => r.id === selectedRecipe.id);
  //     if (!existingRecipe) {
  //       console.log(
  //         `Recipe ${selectedRecipe.title} does not exist. Adding to database...`
  //       );
  //       const ingredients = selectedRecipe.extendedIngredients
  //         ? selectedRecipe.extendedIngredients
  //             .map((ingredient) => ingredient.name)
  //             .join(", ")
  //         : "No ingredients listed";
  //       await addRecipe({
  //         id: selectedRecipe.id,
  //         name: selectedRecipe.title,
  //         category: selectedRecipe.dishTypes?.[0] || "Uncategorized",
  //         image_url: selectedRecipe.image || "https://via.placeholder.com/150",
  //         ingredients: ingredients,
  //         source_url: selectedRecipe.sourceUrl || "https://spoonacular.com",
  //         steps: selectedRecipe.instructions || "No steps provided.",
  //         ready_in_minutes: selectedRecipe.readyInMinutes || 30,
  //         servings: selectedRecipe.servings || 2,
  //       });
  //       console.log(`Recipe ${selectedRecipe.title} added successfully.`);
  //     } else {
  //       console.log(`Recipe ${selectedRecipe.title} already exists.`);
  //     }
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     await addMealToPlan({
  //       recipe_id: selectedRecipe.id,
  //       meal_type: "Dinner",
  //     });
  //     console.log(`Meal added: ${selectedRecipe.title}`);
  //     const recipeIngredients =
  //       selectedRecipe.usedIngredients ||
  //       selectedRecipe.extendedIngredients ||
  //       [];
  //     if (!Array.isArray(recipeIngredients)) {
  //       console.error("Error: No valid ingredients found for this recipe.");
  //       return;
  //     }
  //     const groceryResponse = await fetchGroceryList();
  //     const groceryList = groceryResponse.data || [];
  //     recipeIngredients.forEach((ingredient) => {
  //       const existingItem = groceryList.find(
  //         (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
  //       );
  //       if (existingItem) {
  //         updateGroceryListItem(existingItem.id, {
  //           items: ingredient.name,
  //         });
  //       } else {
  //         addItemToGroceryList({ items: ingredient.name });
  //       }
  //     });
  //     console.log(
  //       `Grocery list updated with missing ingredients for ${selectedRecipe.title}.`
  //     );
  //     setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  //   } catch (error) {
  //     console.error(
  //       "Error adding meal:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };
  // const handleSkipRecipe = () => {
  //   setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  // };
  // const selectedRecipe = recipes[currentRecipeIndex];
  // return (
  //   <div>
  //     <h1>Surprise Me!</h1>
  //     {selectedRecipe ? (
  //       <div>
  //         <h2>{selectedRecipe.title}</h2>
  //         <img
  //           src={selectedRecipe.image || "https://via.placeholder.com/150"}
  //           alt={selectedRecipe.title}
  //         />
  //         <p>Likes: {selectedRecipe.aggregateLikes || 0}</p>{" "}
  //         <h3>Used Ingredients:</h3>
  //         <ul>
  //           {selectedRecipe.usedIngredients &&
  //           selectedRecipe.usedIngredients.length > 0 ? (
  //             selectedRecipe.usedIngredients.map((ingredient) => (
  //               <li key={ingredient.id}>
  //                 <img src={ingredient.image} alt={ingredient.name} />{" "}
  //                 {ingredient.original}
  //               </li>
  //             ))
  //           ) : (
  //             <p>No used ingredients found.</p>
  //           )}
  //         </ul>
  //         <h3>Missed Ingredients:</h3>
  //         <ul>
  //           {selectedRecipe.missedIngredients &&
  //           selectedRecipe.missedIngredients.length > 0 ? (
  //             selectedRecipe.missedIngredients.map((ingredient) => (
  //               <li key={ingredient.id}>
  //                 <img src={ingredient.image} alt={ingredient.name} />{" "}
  //                 {ingredient.original}
  //               </li>
  //             ))
  //           ) : (
  //             <p>No missed ingredients found.</p>
  //           )}
  //         </ul>
  //         <button onClick={handleAddToMealPlan}>Add to Meal Plan</button>
  //         <button onClick={handleSkipRecipe}>Skip</button>
  //       </div>
  //     ) : (
  //       <p>Loading recipes or no recipes found...</p>
  //     )}
  //   </div>
  // );
};

export default SurpriseMe;
