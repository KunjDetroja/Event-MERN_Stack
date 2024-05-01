const mongoose = require("mongoose");
const { populate } = require("./event.model");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const memberappliedSchema = new Schema({
  id: {
    type: ObjectId,
    ref: "User",
  },
  name: { type: String },
  email: { type: String },
  phonenumber: { type: Number },
  gender: { type: String, enum: ["male", "female"] },
  username: { type: String },
  password: { type: String },
  membertype: { type: String },
  clubname: { type: String },
});

const membertypeSchema = new Schema({
  type: { type: String },
  price: { type: Number },
});

const organisationSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    clubname: {
      type: String,
      required: true,
      unique: true,
    },
    ownname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      // required: true
    },
    background_image: {
      type: String,
      // required: true
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    membertype: [membertypeSchema],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberapplied: [memberappliedSchema],
    feedback: [
      {
        type: String,
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Organisation = mongoose.model("Organisation", organisationSchema);
module.exports = { Organisation, organisationSchema };
