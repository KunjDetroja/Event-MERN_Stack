const mongoose = require("mongoose");
const { Schema } = mongoose;
const { organisationSchema } = require("./organisation.model.js");

const userSchema = new Schema(
  {
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    username: {
      type: String,
    },
    password: String,
    name: String,
    email: String,
    phonenumber: Number,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    memberid: {
      type: String,
      default: null,
    },
    membertype: {
      type: String,
      default: "Public",
    },
    subscribe: {
      type: Boolean,
      default: false,
    },
    clubname: {
      type: String,
      default: null,
    },
    expiry_date: {
      type: Date,
      default: null,
    },
    start_date: {
      type: Date,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_login: {
      type: Boolean,
      default: false,
    },
    applied_org: [organisationSchema],
    orgfeedback: [
      {
        username: String,
        feedback: String,
      },
    ],
    userfeedback: [
      {
        username: String,
        feedback: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
