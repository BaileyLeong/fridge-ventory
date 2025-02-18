import axios from "axios";

const API_KEY = process.env.SPOONACULAR_API_KEY;

export const searchIngredients = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/search`,
      {
        params: {
          query,
          number: 10,
          apiKey: API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error searching ingredients:", error);
    res.status(500).json({ error: "Failed to search ingredients" });
  }
};
