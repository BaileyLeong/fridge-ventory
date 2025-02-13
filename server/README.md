## Database Setup

### 1. Install Dependencies

Make sure you have Knex and MySQL installed in your project:

```sh
npm install knex mysql2
```

### 2. Run Migrations

Before inserting data, ensure your database schema is set up correctly:

```sh
npx knex migrate:latest
```

### 3. Seed the Database

After running migrations, seed the database with:

```sh
npx knex seed:run
```
