import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/NavBar/NavBar";
import Welcome from "./pages/Welcome/Welcome";
import Dashboard from "./pages/Dashboard/Dashboard";
import FridgeManagement from "./pages/FridgeManagement/FridgeManagement";
import MealPlanner from "./pages/MealPlanner/MealPlanner";
import Favorites from "./pages/Favorites/Favorites";
import GroceryList from "./pages/GroceryList/GroceryList";
import SurpriseMe from "./pages/SurpriseMe/SurpriseMe";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Footer from "./components/Footer/Footer";
import "./App.scss";

function App() {
  const [showNavbar, setShowNavbar] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setShowNavbar(location.pathname !== "/");
  }, [location.pathname]);

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="main">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fridge" element={<FridgeManagement />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/grocery-list" element={<GroceryList />} />
          <Route path="/surprise-me" element={<SurpriseMe />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {showNavbar && <Footer />}
    </>
  );
}

export default App;
