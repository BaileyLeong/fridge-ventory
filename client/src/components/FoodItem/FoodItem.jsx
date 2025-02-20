import React from "react";
import {
  formatDateForDisplay,
  capitalizeFirstLetter,
  formatQuantity,
} from "../../utils/utils.js";

const FoodItem = ({
  item,
  updateValues,
  setUpdateValues,
  onUpdateQuantity,
  onUpdateExpiry,
  onDeleteItem,
}) => {
  const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
  const today = new Date();
  const fiveDaysFromNow = new Date();
  fiveDaysFromNow.setDate(today.getDate() + 5);

  const isExpiringSoon =
    expiresAt && expiresAt <= fiveDaysFromNow && expiresAt >= today;

  return (
    <li
      className={`fridge__item ${
        isExpiringSoon ? "fridge__item--expiring-soon" : ""
      }`}
    >
      <div
        className={`fridge__item-photo-container${
          isExpiringSoon ? " fridge__item-photo-container--expiring-soon" : ""
        }`}
      >
        <img
          className="fridge__item-photo"
          src={item.image_url || "https://placehold.co/500"}
          alt={item.ingredient_name}
        />
      </div>
      <strong className="fridge__item-name">
        {capitalizeFirstLetter(item.ingredient_name)}
      </strong>
      (Expires: {formatDateForDisplay(item.expires_at)}) | Qty:{" "}
      {formatQuantity(item.quantity)} {item.unit || ""}
      <input
        className="fridge__input fridge__input--quantity"
        type="number"
        placeholder="New Quantity"
        value={updateValues[item.id]?.quantity || ""}
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
        className="fridge__button fridge__button--update"
        onClick={() => onUpdateQuantity(item.id)}
      >
        Update Quantity
      </button>
      <input
        className="fridge__input fridge__input--date"
        type="date"
        value={updateValues[item.id]?.expires_at || ""}
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
        className="fridge__button fridge__button--update"
        onClick={() => onUpdateExpiry(item.id)}
      >
        Update Expiry
      </button>
      <button
        className="fridge__button fridge__button--delete"
        onClick={() => onDeleteItem(item.id)}
      >
        Delete
      </button>
    </li>
  );
};

export default FoodItem;
