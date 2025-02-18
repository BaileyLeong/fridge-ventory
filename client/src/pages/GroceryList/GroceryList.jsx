import { useEffect, useState } from "react";
import {
  fetchGroceryList,
  fetchRecipes,
  addGroceryItem,
  removeGroceryItem,
  moveGroceryToFridge,
} from "../../api/apiClient";
import "./GroceryList.scss";

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchGroceryList()
      .then((response) => setGroceryList(response.data))
      .catch((error) => console.error("Error fetching grocery list:", error));

    fetchRecipes()
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      addGroceryItem({ name: newItem, quantity: 1, completed: false })
        .then(() => {
          setNewItem("");
          fetchGroceryList().then((response) => setGroceryList(response.data));
        })
        .catch((error) => console.error("Error adding item:", error));
    }
  };

  const handleDeleteItem = (id) => {
    removeGroceryItem(id)
      .then(() =>
        fetchGroceryList().then((response) => setGroceryList(response.data))
      )
      .catch((error) => console.error("Error deleting item:", error));
  };

  const handleCompleteItem = (id) => {
    moveGroceryToFridge(id)
      .then(() =>
        fetchGroceryList().then((response) => setGroceryList(response.data))
      )
      .catch((error) => console.error("Error moving item to fridge:", error));
  };

  return (
    <div className="grocery">
      <h1 className="grocery__title">Grocery List</h1>
      <div className="grocery__input-container">
        <input
          className="grocery__input"
          type="text"
          placeholder="Add grocery item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          className="grocery__button grocery__button--add"
          onClick={handleAddItem}
        >
          Add
        </button>
      </div>
      <ul className="grocery__list">
        {groceryList.map((item) => (
          <li key={item.id} className="grocery__item">
            <span className="grocery__item-name">
              {item.ingredient_name || "Unknown Item"}
            </span>
            <div className="grocery__checkbox-container">
              <input
                className="grocery__checkbox"
                type="checkbox"
                checked={false}
                onChange={() => handleCompleteItem(item.id)}
              />
              <label className="grocery__label">Mark as Purchased</label>
            </div>
            <button
              className="grocery__button grocery__button--delete"
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

export default GroceryList;
