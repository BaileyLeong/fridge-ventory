import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "../NavBar/NavBar.scss";
import menuIcon from "../../assets/icons/menu-icon.svg";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <button className="navbar__toggle" onClick={toggleMenu}>
          <img src={menuIcon} alt="menu icon" />
        </button>
        <NavLink to="/">
          <h1 className="navbar__title">Fridge-Ventory</h1>
        </NavLink>

        <ul className={`navbar__list ${menuOpen ? "navbar__list--open" : ""}`}>
          <li className="navbar__item">
            <NavLink to="/dashboard" className="navbar__link">
              Dashboard
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink to="/fridge" className="navbar__link">
              Fridge
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink to="/meal-planner" className="navbar__link">
              Meal Planner
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink to="/grocery-list" className="navbar__link">
              Grocery List
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink to="/favorites" className="navbar__link">
              Favorites
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/surprise-me"
              className="navbar__link navbar__link--special"
            >
              I'm Bored!
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
