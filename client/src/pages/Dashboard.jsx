import { useEffect, useState } from "react";
import { fetchFridgeItems } from "../api/apiClient";
import "./Dashboard.scss";

const Dashboard = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const fridgeResponse = await fetchFridgeItems();
        console.log("Fridge API response:", fridgeResponse.data);
        const items = Array.isArray(fridgeResponse.data)
          ? fridgeResponse.data
          : fridgeResponse.data.items || [];
        setFridgeItems(items);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error fetching dashboard data. Please try again later.");
      }
    };

    getData();
  }, []);

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <article>
        <h2>Your Fridge</h2>
        {fridgeItems.length > 0 ? (
          <ul>
            {fridgeItems.map((item) => (
              <li key={item.id}>
                {item.name} (Expires: {item.expiry_date})
              </li>
            ))}
          </ul>
        ) : (
          <p>No fridge items found.</p>
        )}
      </article>
    </section>
  );
};

export default Dashboard;
