require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");

/* Session stuff */
const session = require("express-session");
const Redis = require("ioredis");
const redis = new Redis();
let RedisStore = require("connect-redis")(session);

/* Auth stuff */
const mdb = require("./db/MDB");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static("public"));

mdb.on("error", console.error.bind(console, "connection error:"));

app.use(
  session({
    store: new RedisStore({ client: redis }),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
);

app.get("/", connectEnsureLogin.ensureLoggedIn("/login"), (req, res) => {
  res.render("pages/account");
});
app.get("/login", (req, res) => {
  res.render("pages/login");
});
app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/register", (req, res) => {
  console.log("Body: ", req.body);

  User({
    username: req.body.username,
    password: req.body.username,
  }).save((err, user) => {
    if (err) res.redirect("/register");
    res.redirect("/login");
  });
});

mdb.once("open", function () {
  app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`);
  });
});
