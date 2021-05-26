const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("User: ", req.user);
  res.send({ message: "hello", user: req.user });
});

module.exports = router;
