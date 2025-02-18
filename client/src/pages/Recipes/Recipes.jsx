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
    <div className="recipes">
      <h1 className="recipes__title">Recipes</h1>

      {recipes.length === 0 ? (
        <p className="recipes__message">No recipes found. Try adding some!</p>
      ) : (
        <ul className="recipes__list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipes__item">
              <h3 className="recipes__item-title">{recipe.name}</h3>
              <img
                className="recipes__item-image"
                src={recipe.image_url || "https://via.placeholder.com/150"}
                alt={recipe.name}
              />
              <p className="recipes__item-time">
                Ready in {recipe.ready_in_minutes} minutes
              </p>

              <button className="recipes__button recipes__button--view">
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recipes__link"
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
