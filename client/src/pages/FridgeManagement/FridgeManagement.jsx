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
  const [newItem, setNewItem] = useState({
    name: "",
    expires_at: "",
    quantity: 1,
  });
  const [updateValues, setUpdateValues] = useState({});
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
    <div>
      <h1>Fridge Management</h1>
      <input
        type="text"
        placeholder="Item name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={newItem.quantity}
        onChange={(e) =>
          setNewItem({ ...newItem, quantity: Number(e.target.value) })
        }
      />
      <input
        type="date"
        value={newItem.expires_at}
        onChange={(e) => setNewItem({ ...newItem, expires_at: e.target.value })}
      />
      <button onClick={handleAddItem}>Add Item</button>

      <ul>
        {fridgeItems.map((item) => (
          <li key={item.id}>
            {item.name} (Expires: {item.expires_at || "No expiry set"}) | Qty:{" "}
            {item.quantity}
            <input
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
            <button onClick={() => handleUpdateQuantity(item.id)}>
              Update Quantity
            </button>
            <input
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
            <button onClick={() => handleUpdateExpiry(item.id)}>
              Update Expiry
            </button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FridgeManagement;
