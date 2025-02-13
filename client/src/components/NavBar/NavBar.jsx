import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul>
        {location.pathname !== "/" && (
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>
        )}
        {location.pathname !== "/fridge" && (
          <li>
            <NavLink to="/fridge">Fridge</NavLink>
          </li>
        )}
        {location.pathname !== "/recipes" && (
          <li>
            <NavLink to="/recipes">Recipes</NavLink>
          </li>
        )}
        {location.pathname !== "/meal-planner" && (
          <li>
            <NavLink to="/meal-planner">Meal Planner</NavLink>
          </li>
        )}
        {location.pathname !== "/grocery-list" && (
          <li>
            <NavLink to="/grocery-list">Grocery List</NavLink>
          </li>
        )}
        {location.pathname !== "/favorites" && (
          <li>
            <NavLink to="/favorites">Favorites</NavLink>
          </li>
        )}
        {location.pathname !== "/surprise-me" && (
          <li>
            <NavLink to="/surprise-me">I'm Bored!</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
