import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import EnterFridge from "../../components/EnterFridge/EnterFridge";
import "../Welcome/Welcome.scss";

function Welcome() {
  const [fridgeEntered, setFridgeEntered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (fridgeEntered) {
      setIsFocused(true);
      setTimeout(() => {
        setIsFocused(false);
      }, 500);
    }
  }, [fridgeEntered]);

  return (
    <section className={`welcome ${isFocused ? "welcome--focus" : ""}`}>
      {!fridgeEntered ? (
        <EnterFridge onFinish={() => setFridgeEntered(true)} />
      ) : (
        <div
          className={`welcome__content ${
            isFocused ? "welcome__content--focus" : ""
          }`}
        >
          <div className="welcome__hero">
            <h1 className="welcome__hero-title">Fridge-Ventory</h1>
            <p className="welcome__hero-description">
              Manage your fridge, find recipes, and plan meals with ease.
            </p>
          </div>
          <nav className="welcome__nav">
            <NavLink to="/dashboard" className="welcome__button">
              Sign Up
            </NavLink>
            <NavLink to="/dashboard" className="welcome__button">
              Sign In
            </NavLink>
          </nav>
        </div>
      )}
    </section>
  );
}

export default Welcome;
