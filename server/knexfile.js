import "dotenv/config";

console.log(
  "DB Connection:",
  process.env.DB_LOCAL_HOST,
  process.env.DB_LOCAL_DBNAME
);

export default {
  client: "mysql2",
  connection: {
    host: process.env.DB_LOCAL_HOST,
    database: process.env.DB_LOCAL_DBNAME,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
    charset: "utf8",
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};
