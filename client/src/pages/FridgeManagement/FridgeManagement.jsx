import { useEffect, useState } from "react";
import {
  fetchFridgeItems,
  addFridgeItem,
  updateFridgeItem,
  deleteFridgeItem,
  searchIngredients,
} from "../../api/apiClient";
import "./FridgeManagement.scss";
import {
  formatDateForDisplay,
  capitalizeFirstLetter,
  formatQuantity,
} from "../../utils/utils.js";

const UNIT_OPTIONS = [
  "g",
  "kg",
  "ml",
  "L",
  "oz",
  "lb",
  "cup",
  "tsp",
  "tbsp",
  null,
];

const initialFormState = {
  name: "",
  ingredient_id: null,
  expires_at: "",
  quantity: 1,
  unit: null,
};

const FridgeManagement = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [newItem, setNewItem] = useState(initialFormState);
  const [updateValues, setUpdateValues] = useState({});
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerRow(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerRow(2);
      } else {
        setItemsPerRow(1);
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

  const refreshFridgeItems = () => {
    fetchFridgeItems()
      .then((response) => setFridgeItems(response.data))
      .catch((error) => console.error("Error fetching fridge items:", error));
  };

  useEffect(() => {
    refreshFridgeItems();
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

  const handleAddItem = () => {
    if (!newItem.ingredient_id) {
      alert("Please select a valid ingredient from the suggestions.");
      return;
    }

    addFridgeItem(newItem)
      .then(() => {
        refreshFridgeItems();

        setNewItem({ ...initialFormState });
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const handleUpdateQuantity = (id) => {
    const newQuantity = updateValues[id]?.quantity;
    if (newQuantity === null || newQuantity === undefined) return;

    updateFridgeItem(id, { quantity: Number(newQuantity) })
      .then(() => {
        refreshFridgeItems();
        setUpdateValues((prev) => ({
          ...prev,
          [id]: {
            ...(prev[id] || {}),
            quantity: "",
          },
        }));
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };

  const handleUpdateExpiry = (id) => {
    const newExpiry = updateValues[id]?.expires_at;
    if (!newExpiry) return;

    updateFridgeItem(id, { expires_at: newExpiry })
      .then(() => {
        refreshFridgeItems();
        setUpdateValues((prev) => ({
          ...prev,
          [id]: {
            ...(prev[id] || {}),
            expires_at: "",
          },
        }));
      })
      .catch((error) => console.error("Error updating expiry date:", error));
  };

  const handleDeleteItem = (id) => {
    deleteFridgeItem(id)
      .then(refreshFridgeItems)
      .catch((error) => console.error("Error deleting item:", error));
  };

  const sortedFridgeItems = [...fridgeItems].sort((a, b) => {
    if (sortBy === "expiring") {
      const dateA = a.expires_at
        ? new Date(a.expires_at)
        : new Date(9999, 11, 31);
      const dateB = b.expires_at
        ? new Date(b.expires_at)
        : new Date(9999, 11, 31);
      return dateA - dateB;
    } else if (sortBy === "newest") {
      return b.id - a.id;
    }
    return 0;
  });

  console.log("sorted:", sortedFridgeItems);

  return (
    <div className="fridge">
      <h1 className="fridge__title">Fridge Management</h1>
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
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                quantity: Number(e.target.value),
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

          <input
            className="fridge__input fridge__input--date"
            type="date"
            value={newItem.expires_at || ""}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                expires_at: e.target.value || null,
              })
            }
          />

          <button
            className="fridge__button fridge__button--add"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
      )}

      <label
        className="fridge__label fridge__label--sort"
        htmlFor="sortOptions"
      >
        Sort by:
      </label>
      <select
        id="sortOptions"
        className="fridge__select fridge__select--sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="expiring">Expiring Soon</option>
        <option value="newest">Newest First</option>
      </select>

      <ul className="fridge__list">
        {sortedFridgeItems.map((item) => {
          const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
          const today = new Date();
          const fiveDaysFromNow = new Date();
          fiveDaysFromNow.setDate(today.getDate() + 5);

          const isExpiringSoon =
            expiresAt && expiresAt <= fiveDaysFromNow && expiresAt >= today;

          return (
            <li
              key={item.id}
              className={`fridge__item ${
                isExpiringSoon ? "fridge__item--expiring-soon" : ""
              }`}
            >
              <div
                className={`fridge__item-photo-container${
                  isExpiringSoon
                    ? " fridge__item-photo-container--expiring-soon"
                    : ""
                }`}
              >
                <img
                  className="fridge__item-photo"
                  src={item.image_url || "https://placehold.co/500"}
                  alt={item.ingredient_name}
                />
              </div>
              <strong className="fridge__item-name">
                {capitalizeFirstLetter(item.ingredient_name)}
              </strong>
              (Expires: {formatDateForDisplay(item.expires_at)}) | Qty:{" "}
              {formatQuantity(item.quantity)} {item.unit || ""}
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
          );
        })}
        {Array.from({
          length:
            (itemsPerRow - (fridgeItems.length % itemsPerRow)) % itemsPerRow,
        }).map((_, index) => (
          <li
            key={`spacer-${index}`}
            className="fridge__item fridge__item--spacer"
          />
        ))}
      </ul>
    </div>
  );
};

export default FridgeManagement;
