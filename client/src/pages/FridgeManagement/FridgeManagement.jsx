import { useEffect, useState } from "react";
import {
  fetchFridgeItems,
  addFridgeItem,
  updateFridgeItem,
  deleteFridgeItem,
} from "../../api/apiClient";
import "./FridgeManagement.scss";

const FridgeManagement = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", expiry_date: "" });

  useEffect(() => {
    fetchFridgeItems()
      .then((response) => setFridgeItems(response.data))
      .catch((error) => console.error("Error fetching fridge items:", error));
  }, []);

  const handleAddItem = () => {
    addFridgeItem(newItem)
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error adding item:", error));
  };

  const handleUpdateItem = (id, updatedData) => {
    updateFridgeItem(id, updatedData)
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error updating item:", error));
  };

  const handleDeleteItem = (id) => {
    deleteFridgeItem(id)
      .then(() =>
        fetchFridgeItems().then((response) => setFridgeItems(response.data))
      )
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div>
      <h1>Fridge Management</h1>
      <input
        type="text"
        placeholder="Item name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        type="date"
        value={newItem.expiry_date}
        onChange={(e) =>
          setNewItem({ ...newItem, expiry_date: e.target.value })
        }
      />
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {fridgeItems.map((item) => (
          <li key={item.id}>
            {item.name} (Expires: {item.expiry_date})
            <button
              onClick={() =>
                handleUpdateItem(item.id, { name: "Updated Item" })
              }
            >
              Edit
            </button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FridgeManagement;
