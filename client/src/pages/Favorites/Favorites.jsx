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
    <div className="favorites">
      <h1 className="favorites__title">Favorite Recipes</h1>

      {favorites.length === 0 ? (
        <p className="favorites__message">
          You haven't favorited any recipes yet.
        </p>
      ) : (
        <ul className="favorites__list">
          {favorites.map((recipe) => (
            <li key={recipe.id} className="favorites__item">
              <h2 className="favorites__item-title">{recipe.name}</h2>
              <img
                className="favorites__item-image"
                src={recipe.image_url}
                alt={recipe.name}
              />
              <p className="favorites__item-time">
                Ready in {recipe.ready_in_minutes} minutes
              </p>
              <p className="favorites__item-servings">
                Servings: {recipe.servings}
              </p>

              <button className="favorites__button favorites__button--view">
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="favorites__link"
                >
                  View Full Recipe
                </a>
              </button>

              <button
                className="favorites__button favorites__button--remove"
                onClick={() => handleRemoveFavorite(recipe.id)}
              >
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
