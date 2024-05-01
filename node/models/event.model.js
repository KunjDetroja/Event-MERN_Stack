const mongoose = require("mongoose");
const { Schema } = mongoose;

const participateSchema = new Schema({
  name: String,
  email: String,
  phone_number: Number,
  gender: String,
  usernane: Number,
  age: Number,
  payment_type: {
    type: String,
    enum: ["Online", "Offline"],
  },
  upi_id: String,
  city: String,
});

const feedbackSchema = new Schema({
  username: String,
  email: String,
  feedback: String,
});

const eventpostSchema = new Schema(
  {
    clubname: String,
    event_title: String,
    event_image: String,
    event_start_date: Date,
    event_end_date: Date,
    start_time: String,
    end_time: String,
    venue_name: String,
    venue_address: String,
    type: String,
    venue_city: String,
    ticket_price: Number,
    event_highlight: String,
    capacity: Number,
    event_desc: String,
    event_organizer_name: String,
    event_organizer_email: String,
    event_organizer_pnumber: Number,
    participate: [participateSchema],
    feedback: [feedbackSchema],
    is_active: Boolean,
    is_deleted: Boolean,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Eventpost = mongoose.model("Eventpost", eventpostSchema);
module.exports = Eventpost;
