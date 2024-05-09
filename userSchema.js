const Schema = mongoose.Schema;
const mongoose = require("mongoose");

export const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true }
    })
  );