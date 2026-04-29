const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const https = require('https');
const fs = require('fs');

const app = express();

// Middlewares

const auth = require('./middleware/auth');
const admin = require('./middleware/admin');

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (CSS, images, uploads...)
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------
// Routes API (retournent du JSON)
// ---------------------------------------------------------------
const authRoute = require("./routes/Auth");
const profileRoute = require("./routes/Profile");
const adminRoute = require("./routes/Admin");

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/admin", adminRoute);

// ---------------------------------------------------------------
// Routes pages (retournent du HTML)
// ---------------------------------------------------------------
const homeRoute = require("./routes/Home");
const userRoute = require("./routes/User");

app.use("/", homeRoute);
app.use("/user", userRoute);


const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: { error: "Trop de tentatives, réessayez dans 15 minutes." }
});
app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html")),
);
app.get("/register", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html")),
);
app.get("/profile", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "profile.html")),
);
app.get("/admin", auth, admin, (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "admin.html")),
);

const options = {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
};

// Création le serveur HTTPS
const PORT = 8080;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Serveur sécurisé démarré sur https://localhost:${PORT}`);
});
