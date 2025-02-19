import { useState, useEffect } from "react";
import "./EnterFridge.scss";

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
    <section className="fridge-entry">
      <div
        className={`fridge-entry__container ${
          isZooming ? "fridge-entry__container--zooming" : ""
        }`}
        onMouseEnter={() => setIsZooming(true)}
      >
        <div className="fridge-entry__door fridge-entry__door--left">
          <div className="fridge-entry__handle fridge-entry__handle--left"></div>
        </div>
        <div className="fridge-entry__door fridge-entry__door--right">
          <div className="fridge-entry__handle fridge-entry__handle--right"></div>
        </div>
      </div>
    </section>
  );
}
export default EnterFridge;
