import {
  formatDateForDisplay,
  capitalizeFirstLetter,
  formatQuantity,
  hideExpiry,
} from "../../utils/utils.js";
import "../FoodItem/FoodItem.scss";
import { useState } from "react";

const FoodItem = ({
  item,
  updateValues,
  setUpdateValues,
  onUpdateQuantity,
  onUpdateExpiry,
  onDeleteItem,
  readOnly = false,
}) => {
  const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
  const today = new Date();
  const fiveDaysFromNow = new Date();
  fiveDaysFromNow.setDate(today.getDate() + 5);
  const isExpiringSoon =
    expiresAt && expiresAt <= fiveDaysFromNow && expiresAt >= today;
  const formattedExpiry = formatDateForDisplay(item.expires_at);
  const expiryDisplay = item.expires_at ? hideExpiry(formattedExpiry) : "";
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li
      className={`food-item ${
        isExpiringSoon ? "food-item--expiring-soon" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setShowDetails((prev) => !prev);
      }}
    >
      {!showDetails && (
        <div
          className={`food-item__photo-container ${
            isExpiringSoon ? "food-item__photo-container--expiring-soon" : ""
          }`}
        >
          <img
            className="food-item__photo"
            src={item.image_url || "https://placehold.co/500"}
            alt={item.ingredient_name}
          />
        </div>
      )}
      <strong className="food-item__name">
        {capitalizeFirstLetter(item.ingredient_name)}
      </strong>
      <span className="food-item__quantity">
        Qty: {formatQuantity(item.quantity)} {item.unit || ""}
      </span>
      {!readOnly && (
        <>
          <span className="food-item__expiry">
            {expiryDisplay ? `(Expires: ${expiryDisplay})` : ""}
          </span>

          <div className="food-item__actions">
            {showDetails && (
              <>
                <input
                  className="food-item__input food-item__input--date"
                  type="date"
                  value={updateValues[item.id]?.expires_at || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    setUpdateValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        expires_at: e.target.value,
                      },
                    }))
                  }
                />
                <button
                  className="food-item__button food-item__button--update"
                  onClick={() => onUpdateExpiry(item.id)}
                >
                  Update Expiry
                </button>
                <input
                  className="food-item__input food-item__input--quantity"
                  type="number"
                  placeholder="New Quantity"
                  value={updateValues[item.id]?.quantity || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    setUpdateValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        quantity: e.target.value,
                      },
                    }))
                  }
                />
                <button
                  className="food-item__button food-item__button--update"
                  onClick={() => onUpdateQuantity(item.id)}
                >
                  Update Quantity
                </button>
                <span className="food-item__details--spacer"></span>
              </>
            )}
          </div>
          <button
            className="food-item__button food-item__button--delete"
            onClick={() => onDeleteItem(item.id)}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
};

export default FoodItem;
