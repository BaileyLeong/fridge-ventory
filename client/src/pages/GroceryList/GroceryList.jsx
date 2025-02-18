// import { useEffect, useState } from "react";
// import {
//   fetchGroceryList,
//   fetchRecipes,
//   addItemToGroceryList,
//   deleteGroceryListItem,
// } from "../../api/apiClient";
import "./GroceryList.scss";

const GroceryList = () => {
  //   const [groceryList, setGroceryList] = useState([]);
  //   const [newItem, setNewItem] = useState("");
  //   const [recipes, setRecipes] = useState([]);
  //   useEffect(() => {
  //     fetchGroceryList()
  //       .then((response) => setGroceryList(response.data))
  //       .catch((error) => console.error("Error fetching grocery list:", error));
  //     fetchRecipes()
  //       .then((response) => setRecipes(response.data))
  //       .catch((error) => console.error("Error fetching recipes:", error));
  //   }, []);
  //   const handleAddItem = () => {
  //     if (newItem.trim() !== "") {
  //       addItemToGroceryList({ items: newItem })
  //         .then(() => {
  //           setNewItem("");
  //           fetchGroceryList().then((response) => setGroceryList(response.data));
  //         })
  //         .catch((error) => console.error("Error adding item:", error));
  //     }
  //   };
  //   const handleDeleteItem = (id) => {
  //     deleteGroceryListItem(id)
  //       .then(() =>
  //         fetchGroceryList().then((response) => setGroceryList(response.data))
  //       )
  //       .catch((error) => console.error("Error deleting item:", error));
  //   };
  //   return (
  //     <div>
  //       <h1>Grocery List</h1>
  //       <input
  //         type="text"
  //         placeholder="Add grocery item"
  //         value={newItem}
  //         onChange={(e) => setNewItem(e.target.value)}
  //       />
  //       <button onClick={handleAddItem}>Add</button>
  //       <ul>
  //         {groceryList.map((item) => (
  //           <li key={item.id}>
  //             {item.name}{" "}
  //             <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
};

export default GroceryList;
