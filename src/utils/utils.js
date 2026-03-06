export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "No date set";
  // Parse YYYY-MM-DD as local date so it doesn't shift to previous day in timezones behind UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateString).trim())) {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** Parses YYYY-MM-DD as local date and returns long weekday name (e.g. "Monday"). */
export const formatWeekday = (dateString) => {
  if (!dateString) return "";
  const s = String(dateString).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }
  }
  return new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });
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

export const CUISINE_OPTIONS = [
  "African",
  "Asian",
  "American",
  "British",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "European",
  "French",
  "German",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Jewish",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "Southern",
  "Spanish",
  "Thai",
  "Vietnamese",
];

export const MEAL_TYPE_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack"];
