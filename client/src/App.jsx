import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import FridgeManagement from "./pages/FridgeManagement/FridgeManagement";
import Recipes from "./pages/Recipes/Recipes";
import MealPlanner from "./pages/MealPlanner/MealPlanner";
import Favorites from "./pages/Favorites/Favorites";
import GroceryList from "./pages/GroceryList/GroceryList";
import Navbar from "./components/NavBar/NavBar";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import "./App.scss";
import SurpriseMe from "./pages/SurpriseMe/SurpriseMe";
import Welcome from "./pages/Welcome/Welcome";

function App() {
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const handleRouteChange = () => {
      setShowNavbar(location.pathname !== "/");
    };

    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <BrowserRouter>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fridge" element={<FridgeManagement />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/grocery-list" element={<GroceryList />} />
        <Route path="/surprise-me" element={<SurpriseMe />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
