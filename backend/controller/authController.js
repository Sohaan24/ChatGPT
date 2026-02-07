const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const asyncHandler = require("../utils/asyncHandler");

const JWT_SECRET = process.env.JWT_KEY;

const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all requried fields");
  }

  const userCheck = await User.findOne({ email });
  if (userCheck) {
    return res.json({ msg: "Email already exist", status: false });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    password: hashedPassword,
    email,
  });

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
  const userProps = { name: user.name, email: user.email, id: user._id };

  return res.json({ status: true, user: userProps, token });
});

const login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all requried fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ msg: "Invalid email or Password", status: false });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.json({ msg: "Wrong password", status : false });
  }

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
  const userProps = { name: user.name, email: user.email, id: user._id };

  return res.json({ status: true, user: userProps, token });
});

module.exports = { login, signup };
