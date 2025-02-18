import { useEffect, useState } from "react";
import { fetchRecipes } from "../../api/apiClient";
import "./Recipes.scss";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes()
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      {recipes.length === 0 ? (
        <p>No recipes found. Try adding some!</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h3>{recipe.name}</h3>
              <img
                src={recipe.image_url || "https://via.placeholder.com/150"}
                alt={recipe.name}
              />
              <p>Ready in {recipe.ready_in_minutes} minutes</p>
              <button>
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Recipe
                </a>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recipes;
