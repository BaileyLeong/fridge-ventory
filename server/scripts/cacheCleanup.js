import initKnex from "knex";
import configuration from "../knexfile.js";
import cron from "node-cron";

const knex = initKnex(configuration);

const clearExpiredCache = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await knex("recipes").where("cached_at", "<", oneHourAgo).del();
    await knex("recipe_ingredients").where("cached_at", "<", oneHourAgo).del();
    console.log("Expired recipes and ingredients removed successfully.");
  } catch (error) {
    console.error("Error clearing cache", error);
  }
};

cron.schedule("*/30 * * * *", clearExpiredCache);
console.log("Cache cleanup scheduled!");

export default clearExpiredCache;
