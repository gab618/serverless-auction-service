const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    usePushEach: true,
    collection: "users",
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
