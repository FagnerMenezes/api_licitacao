const mongoose = require("mongoose");
const db = require("../db");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    profile: String,
    active: String,
    contact: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
);

const modelUser = mongoose.model("users", userSchema);

module.exports = modelUser;
