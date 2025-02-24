import { useState, useEffect } from "react";
import "../EnterFridge/EnterFridge.scss";

function EnterFridge({ onFinish }) {
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (isZooming) {
      setTimeout(() => {
        onFinish();
      }, 3000);
    }
  }, [isZooming, onFinish]);

  return (
    <article className="fridge-entry">
      <h1
        className={`fridge-entry__title ${
          isZooming ? "fridge-entry__title--zooming" : ""
        }`}
      >
        <mark>Fridge-Ventory</mark>
      </h1>
      <div
        className={`fridge-entry__container ${
          isZooming ? "fridge-entry__container--zooming" : ""
        }`}
        onMouseEnter={() => setIsZooming(true)}
      >
        <img
          className="fridge-entry__image"
          src="src/assets/images/chikken.png"
        ></img>
        <div className="fridge-entry__door fridge-entry__door--left">
          <div className="fridge-entry__handle fridge-entry__handle--left"></div>
        </div>
        <div className="fridge-entry__door fridge-entry__door--right">
          <div className="fridge-entry__handle fridge-entry__handle--right"></div>
        </div>
      </div>
    </article>
  );
}
export default EnterFridge;
