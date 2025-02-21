export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "No date set";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatQuantity = (quantity) => {
  const num = parseFloat(quantity);
  return num.toFixed(3).replace(/\.?0+$/, "");
};

export const hideExpiry = (str) => {
  if (str === "no date set") return "";
  return str;
};

export const UNIT_OPTIONS = [
  "g",
  "kg",
  "ml",
  "L",
  "oz",
  "lb",
  "cup",
  "tsp",
  "tbsp",
  null,
];
