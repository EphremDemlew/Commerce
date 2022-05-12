const express = require("express");
const route = express.Router();
const User = require("../models/users");
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");
const bcrypt = require("bcryptjs");

route.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const emailCheck = await User.findOne({ email: req.body.email });
  if (emailCheck) {
    return res.status(400).send("User alrady registered.");
  }

  //encript(hash) the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const saveUser = await user.save();
    res.status(200).send(`User :${user._id}`);
  } catch (err) {
    res.status(400).send(err);
  }
});

route.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email or Password is incorrect.");
  }
  //check Password
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword) {
    return res.status(400).send("Email or Password is incorrect.");
  }

  res.status(200).send("Loged in sucessfully ");
});

module.exports = route;
