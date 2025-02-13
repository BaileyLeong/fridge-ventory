export const seed = async function (knex) {
  await knex("ingredients").del(); // Clear existing data

  await knex("ingredients").insert([
    { id: 11241, name: "kohlrabi" },
    { id: 1049003, name: "fuji apple" },
    { id: 11300, name: "snow peas" },
    { id: 12036, name: "sunflower seeds" },
    { id: 10123, name: "bacon" },
    { id: 1053, name: "heavy cream" },
    { id: 2048, name: "apple cider vinegar" },
    { id: 19296, name: "honey" },
    { id: 2004, name: "bay leaf" },
    { id: 11109, name: "cabbage" },
    { id: 11124, name: "carrot" },
    { id: 10013346, name: "corned beef brisket" },
    { id: 20027, name: "cornstarch" },
    { id: 1002024, name: "mustard powder" },
    { id: 1125, name: "egg yolks" },
    { id: 1001, name: "butter" },
    { id: 19335, name: "sugar" },
    { id: 14412, name: "water" },
    { id: 2044, name: "basil" },
    { id: 11352, name: "potatoes" },
    { id: 1022020, name: "garlic powder" },
    { id: 1062047, name: "garlic salt" },
    { id: 4669, name: "vegetable oil" },
  ]);
};
