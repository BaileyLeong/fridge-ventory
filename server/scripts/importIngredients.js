import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const csvFilePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../data/top-1k-ingredients.csv"
);

const ingredients = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const id = parseInt(row.id, 10);
    const name = row.name?.trim();

    if (id && name) {
      ingredients.push({ id, name });
    }
  })
  .on("end", async () => {
    console.log(`Read ${ingredients.length} ingredients from CSV.`);

    try {
      await insertIngredients(ingredients);
    } catch (error) {
      console.error("Error inserting ingredients:", error);
    } finally {
      knex.destroy();
    }
  })
  .on("error", (err) => {
    console.error("Error reading CSV:", err);
  });

async function insertIngredients(data) {
  if (data.length === 0) {
    console.log("No data to insert.");
    return;
  }

  try {
    await knex("ingredients").insert(data).onConflict("id").ignore();

    console.log(`Successfully inserted ${data.length} new ingredients.`);
  } catch (error) {
    console.error("Database insert failed:", error);
  }
}
