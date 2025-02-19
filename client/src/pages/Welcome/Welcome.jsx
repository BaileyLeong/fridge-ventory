import { useState } from "react";
import { NavLink } from "react-router-dom";
import EnterFridge from "../../components/EnterFridge/EnterFridge";
import "./Welcome.scss";

function Welcome() {
  const [fridgeEntered, setFridgeEntered] = useState(false);

  return (
    <section className="welcome">
      {!fridgeEntered ? (
        <EnterFridge onFinish={() => setFridgeEntered(true)} />
      ) : (
        <div className="welcome__content">
          <h1 className="welcome__title">Welcome to Fridge-Ventory</h1>
          <p className="welcome__description">
            Manage your fridge, find recipes, and plan meals with ease.
          </p>
          <NavLink to="/dashboard" className="welcome__button">
            Sign In
          </NavLink>
        </div>
      )}
    </section>
  );
}

export default Welcome;
