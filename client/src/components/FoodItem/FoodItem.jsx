import {
  formatDateForDisplay,
  capitalizeFirstLetter,
  formatQuantity,
} from "../../utils/utils.js";
import "./FoodItem.scss";

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

  return (
    <li
      className={`food-item ${
        isExpiringSoon ? "food-item--expiring-soon" : ""
      }`}
    >
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
      <strong className="food-item__name">
        {capitalizeFirstLetter(item.ingredient_name)}
      </strong>
      <span>
        (Expires: {formatDateForDisplay(item.expires_at)}) | Qty:{" "}
        {formatQuantity(item.quantity)} {item.unit || ""}
      </span>

      {!readOnly && (
        <>
          <input
            className="food-item__input food-item__input--quantity"
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
            className="food-item__button food-item__button--update"
            onClick={() => onUpdateQuantity(item.id)}
          >
            Update Quantity
          </button>
          <input
            className="food-item__input food-item__input--date"
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
            className="food-item__button food-item__button--update"
            onClick={() => onUpdateExpiry(item.id)}
          >
            Update Expiry
          </button>
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
