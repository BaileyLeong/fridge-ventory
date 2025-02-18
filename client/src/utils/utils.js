export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "No date set";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
