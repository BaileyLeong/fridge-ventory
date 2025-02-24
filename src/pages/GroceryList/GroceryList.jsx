import { useEffect, useState } from "react";
import {
  fetchGroceryList,
  fetchRecipes,
  addGroceryItem,
  removeGroceryItem,
  markGroceryItemComplete,
  searchIngredients,
  addFridgeItem,
  fetchFridgeItems,
  updateFridgeItem,
} from "../../api/apiClient";
import "../GroceryList/GroceryList.scss";
import { formatQuantity, UNIT_OPTIONS } from "../../utils/utils";

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    ingredient_id: null,
    quantity: 1,
    unit: null,
  });
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchGroceryList()
      .then((response) => setGroceryList(response.data))
      .catch((error) => {
        console.error("Error fetching grocery list:", error);
        setGroceryList([]);
      });

    fetchRecipes()
      .then((response) => setRecipes(response.data))
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      });
  }, []);

  const handleIngredientSearch = async (query) => {
    if (!query || query.length < 3) {
      setIngredientSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await searchIngredients(query);
      setIngredientSuggestions(response.data.results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching ingredients:", error);
      setIngredientSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    setNewItem({
      ...newItem,
      name: ingredient.name,
      ingredient_id: ingredient.id,
    });
    setShowSuggestions(false);
  };

  const handleAddItem = async () => {
    const trimmedName = newItem.name.trim();
    if (!trimmedName || !newItem.ingredient_id) {
      alert("Please select a valid ingredient from the suggestions.");
      return;
    }

    try {
      await addGroceryItem({
        name: trimmedName,
        ingredient_id: newItem.ingredient_id,
        quantity: newItem.quantity,
        unit: newItem.unit,
        completed: false,
      });

      setNewItem({ name: "", ingredient_id: null, quantity: 1, unit: null });
      setShowAddForm(false);

      const response = await fetchGroceryList();
      setGroceryList(response.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="grocery">
      <h1 className="grocery__title">Grocery List</h1>
      <button
        className="fridge__button fridge__input--toggle"
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        {showAddForm ? "Close" : "Add New Item"}
      </button>

      {showAddForm && (
        <div className="fridge__input-container">
          <input
            className="fridge__input fridge__input--text"
            type="text"
            placeholder="Search for an ingredient"
            value={newItem.name}
            onChange={(e) => {
              const newName = e.target.value;
              setNewItem({
                ...newItem,
                name: newName,
                ingredient_id: null,
              });
              handleIngredientSearch(newName);
            }}
            onFocus={() => setShowSuggestions(true)}
          />

          {showSuggestions && ingredientSuggestions.length > 0 && (
            <ul className="fridge__suggestions">
              {ingredientSuggestions.map((ing) => (
                <li
                  key={ing.id}
                  className="fridge__suggestions-item"
                  onClick={() => handleSelectIngredient(ing)}
                >
                  {ing.name}
                </li>
              ))}
            </ul>
          )}

          <input
            className="fridge__input fridge__input--quantity"
            type="number"
            min="1"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                quantity:
                  e.target.value === "" ? 1 : parseFloat(e.target.value),
              })
            }
          />

          <select
            className="fridge__input fridge__input--unit"
            value={newItem.unit || ""}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                unit: e.target.value === "" ? null : e.target.value,
              })
            }
          >
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit || "no-unit"} value={unit === null ? "" : unit}>
                {unit || "No Unit"}
              </option>
            ))}
          </select>

          <button
            className="fridge__button fridge__input--add"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
      )}

      <ul className="grocery__list">
        {groceryList.map((item) => (
          <li key={item.id} className="grocery__item">
            <span className="grocery__item-name">
              {item.ingredient_name || item.name || "Unknown Item"}
            </span>
            <span className="grocery__item-quantity">
              Qty: {formatQuantity(item.quantity)} {item.unit}
            </span>
            <div className="grocery__checkbox-container">
              <input
                className="grocery__checkbox"
                type="checkbox"
                checked={item.completed}
                onChange={async () => {
                  try {
                    await markGroceryItemComplete(item.id, true);

                    const fridgeResponse = await fetchFridgeItems();
                    const existingFridgeItem = fridgeResponse.data.find(
                      (fi) => fi.ingredient_id === item.ingredient_id
                    );

                    if (existingFridgeItem) {
                      const newQuantity =
                        parseFloat(existingFridgeItem.quantity) +
                        parseFloat(item.quantity);
                      await updateFridgeItem(existingFridgeItem.id, {
                        quantity: newQuantity,
                      });
                    } else {
                      await addFridgeItem(item);
                    }
                    await removeGroceryItem(item.id, {
                      headers: { "bypass-meal-plan-check": "true" },
                    });
                    const response = await fetchGroceryList();
                    setGroceryList(response.data);
                  } catch (error) {
                    console.error("Error moving item to fridge:", error);
                  }
                }}
              />
              <label className="grocery__label">Mark as Purchased</label>
            </div>

            <button
              className="grocery__button grocery__button--delete"
              onClick={() => {
                removeGroceryItem(item.id)
                  .then(() =>
                    fetchGroceryList().then((response) =>
                      setGroceryList(response.data)
                    )
                  )
                  .catch((error) =>
                    console.error("Error deleting item:", error)
                  );
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
