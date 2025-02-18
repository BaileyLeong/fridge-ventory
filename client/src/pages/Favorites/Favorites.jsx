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
        console.log("Fetched favorite recipes:", response.data);
        setFavorites(response.data);
      })
      .catch((error) => console.error("Error fetching favorites:", error));
  }, []);

  const handleRemoveFavorite = (id) => {
    removeFavoriteRecipe(id)
      .then(() =>
        fetchFavoriteRecipes().then((response) => setFavorites(response.data))
      )
      .catch((error) => console.error("Error removing favorite:", error));
  };

  return (
    <div>
      <h1>Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <p>You haven't favorited any recipes yet.</p>
      ) : (
        <ul>
          {favorites.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.name}</h2>
              <img src={recipe.image_url} alt={recipe.name} />
              <p>Ready in {recipe.ready_in_minutes} minutes</p>
              <p>Servings: {recipe.servings}</p>
              <button>
                <a
                  href={recipe.source_url}
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
      )}
    </div>
  );
};

export default Favorites;
