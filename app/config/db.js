const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "db_user",
  password: process.env.DB_PASS || "db_password",
  database: process.env.DB_NAME || "webshop",
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    throw err;
  }
  console.log(
    `Connecté à la BDD ${connection.config.database} sur ${connection.config.host} en tant que ${connection.config.user}`,
  );
});

module.exports = connection;
