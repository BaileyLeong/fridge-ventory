import { useEffect, useState } from "react";
import {
  fetchFavoriteRecipes,
  removeFavoriteRecipe,
} from "../../api/apiClient";
import "./Favorites.scss";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavoriteRecipes()
      .then((response) => {
        console.log("Fetched favorite recipes:", response);
        setFavorites(response);
      })
      .catch((error) => console.error("Error fetching favorites:", error));
  }, []);

  const handleRemoveFavorite = (id) => {
    removeFavoriteRecipe(id)
      .then(() =>
        fetchFavoriteRecipes().then((response) => setFavorites(response))
      )
      .catch((error) => console.error("Error removing favorite:", error));
  };

  return (
    <div>
      <h1>Favorite Recipes</h1>
      <ul>
        {favorites.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <img src={recipe.image} alt={recipe.title} />{" "}
            <p>Ready in {recipe.readyInMinutes} minutes</p>
            <p>Servings: {recipe.servings}</p>
            <button>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Recipe
              </a>
            </button>
            <button onClick={() => handleRemoveFavorite(recipe.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
