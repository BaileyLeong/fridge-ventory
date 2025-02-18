import { useEffect, useState } from "react";
import {
  fetchFridgeItems,
  addFridgeItem,
  updateFridgeItem,
  deleteFridgeItem,
  searchIngredients,
} from "../../api/apiClient";
import "./FridgeManagement.scss";
import { formatDateForDisplay } from "../../utils/utils.js";

const FridgeManagement = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    ingredient_id: null,
    expires_at: "",
    quantity: 1,
  });
  const [updateValues, setUpdateValues] = useState({});
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchFridgeItems()
      .then((response) => setFridgeItems(response.data))
      .catch((error) => console.error("Error fetching fridge items:", error));
  }, []);

  const handleIngredientSearch = async (query) => {
    if (!query) {
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

  // Add item to fridge
  const handleAddItem = () => {
    if (!newItem.ingredient_id) {
      alert("Please select a valid ingredient from the suggestions.");
      return;
    }

    addFridgeItem(newItem)
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error adding item:", error));
  };

  const handleUpdateQuantity = (id) => {
    const newQuantity = updateValues[id]?.quantity;
    if (!newQuantity) return;

    updateFridgeItem(id, { quantity: Number(newQuantity) })
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error updating quantity:", error));
  };

  const handleUpdateExpiry = (id) => {
    const newExpiry = updateValues[id]?.expires_at;
    if (!newExpiry) return;

    updateFridgeItem(id, { expires_at: newExpiry })
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error updating expiry date:", error));
  };

  const handleDeleteItem = (id) => {
    deleteFridgeItem(id)
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div className="fridge">
      <h1 className="fridge__title">Fridge Management</h1>

      <input
        className="fridge__input fridge__input--text"
        type="text"
        placeholder="Search for an ingredient"
        value={newItem.name}
        onChange={(e) => {
          setNewItem({ ...newItem, name: e.target.value, ingredient_id: null });
          handleIngredientSearch(e.target.value);
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
        placeholder="Quantity"
        value={newItem.quantity}
        onChange={(e) =>
          setNewItem({ ...newItem, quantity: Number(e.target.value) })
        }
      />

      <input
        className="fridge__input fridge__input--date"
        type="date"
        value={newItem.expires_at || ""}
        onChange={(e) =>
          setNewItem({
            ...newItem,
            expires_at: e.target.value.trim() !== "" ? e.target.value : null,
          })
        }
      />

      <button
        className="fridge__button fridge__button--add"
        onClick={handleAddItem}
      >
        Add Item
      </button>

      <ul className="fridge__list">
        {fridgeItems.map((item) => (
          <li key={item.id} className="fridge__item">
            <img
              className="fridge__item-photo"
              src={item.image_url || "https://placehold.co/100"}
              alt={item.ingredient_name}
            />
            <strong className="fridge__item-name">
              {item.ingredient_name}
            </strong>
            (Expires: {formatDateForDisplay(item.expires_at)}) | Qty:{" "}
            {item.quantity}
            <input
              className="fridge__input fridge__input--quantity"
              type="number"
              placeholder="New Quantity"
              value={updateValues[item.id]?.quantity || ""}
              onChange={(e) =>
                setUpdateValues({
                  ...updateValues,
                  [item.id]: {
                    ...updateValues[item.id],
                    quantity: e.target.value,
                  },
                })
              }
            />
            <button
              className="fridge__button fridge__button--update"
              onClick={() => handleUpdateQuantity(item.id)}
            >
              Update Quantity
            </button>
            <input
              className="fridge__input fridge__input--date"
              type="date"
              value={updateValues[item.id]?.expires_at || ""}
              onChange={(e) =>
                setUpdateValues({
                  ...updateValues,
                  [item.id]: {
                    ...updateValues[item.id],
                    expires_at: e.target.value,
                  },
                })
              }
            />
            <button
              className="fridge__button fridge__button--update"
              onClick={() => handleUpdateExpiry(item.id)}
            >
              Update Expiry
            </button>
            <button
              className="fridge__button fridge__button--delete"
              onClick={() => handleDeleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FridgeManagement;
