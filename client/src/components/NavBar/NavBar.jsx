import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        {location.pathname !== "/" && (
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/">
              Dashboard
            </NavLink>
          </li>
        )}
        {location.pathname !== "/fridge" && (
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/fridge">
              Fridge
            </NavLink>
          </li>
        )}
        {location.pathname !== "/recipes" && (
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/recipes">
              Recipes
            </NavLink>
          </li>
        )}
        {location.pathname !== "/meal-planner" && (
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/meal-planner">
              Meal Planner
            </NavLink>
          </li>
        )}
        {location.pathname !== "/grocery-list" && (
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/grocery-list">
              Grocery List
            </NavLink>
          </li>
        )}
        {location.pathname !== "/favorites" && (
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/favorites">
              Favorites
            </NavLink>
          </li>
        )}
        {location.pathname !== "/surprise-me" && (
          <li className="navbar__item">
            <NavLink
              className="navbar__link navbar__link--special"
              to="/surprise-me"
            >
              I'm Bored!
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
