import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const searchIngredients = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const results = await knex("ingredients")
      .where("name", "like", `%${query}%`)
      .limit(10);

    res.status(200).json({ results });
    console.log({ results });
  } catch (error) {
    console.error("Error searching ingredients:", error);
    res.status(500).json({ error: "Failed to search ingredients" });
  }
};
