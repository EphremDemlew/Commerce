const express = require("express");
const route = express.Router();
const User = require("../models/users");
const { registerValidation } = require("../validation/validation");

route.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const emailCheck = await User.findOne({ email: req.body.email });
  if (emailCheck) {
    return res.status(400).send("User alrady registered.");
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const saveUser = await user.save();
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = route;
