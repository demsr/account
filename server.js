require("dotenv").config();
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("pages/account");
});
app.get("/login", (req, res) => {
  res.render("pages/login");
});
app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post("/login", (req, res) => {});

app.post("/register", (req, res) => {});

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});
