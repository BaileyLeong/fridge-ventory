### Database Setup

1. Run migrations:
   ```sh
   npx knex migrate:latest
   ```
2. Seed the database in the following order to avoid dependency issues:
   ```sh
   npx knex seed:run --specific=001_seed_users.js
   npx knex seed:run --specific=002_seed_recipes.js
   npx knex seed:run --specific=003_seed_favorite_recipes.js
   npx knex seed:run --specific=seed_fridge_items.js
   npx knex seed:run --specific=fetch_recipes_from_spoonacular.js
   ```
