import { useState, useEffect } from "react";
import { fetchFridgeItems } from "../api/apiClient";
import "./Dashboard.scss";

const Dashboard = () => {
  const [fridgeItems, setFridgeItems] = useState([]);

  useEffect(() => {
    fetchFridgeItems()
      .then((response) => setFridgeItems(response.data))
      .catch((error) => console.error("Error fetching fridge items:", error));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Fridge Inventory</h2>
      <ul>
        {fridgeItems.map((item) => (
          <li key={item.id}>
            {item.name} (Expires: {item.expiry_date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
