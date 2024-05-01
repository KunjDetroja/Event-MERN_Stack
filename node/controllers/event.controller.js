const e = require("express");
const Event = require("../models/event.model");
const {successresponse, errorresponse,catchresponse} = require("../utils/utils");
// const Joi = require("joi");

const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find();
    if (events.length == 0) {
      errorresponse(res,404,"No Event Found");
    }
    successresponse(res,events,"All Events Fetched Successfully");
  } catch (error) {
    catchresponse(res);
  }
};

const createEventPost = async (req, res) => {
  try {
    const event = req.body;
    
    const newEvent = new Event(event);
    // const schema = Joi.object({
    //   event_title: Joi.string().required(),
    //   event_description: Joi.string().required(),
    //   event_start_date: Joi.date().required(),
    //   event_end_date: Joi.date().required(),
    //   start_time: Joi.string().required(),
    //   end_time: Joi.string().required(),
    //   venue_name: Joi.string().required(),
    //   venue_address: Joi.string().required(),
    //   venue_city: Joi.string().required(),
    //   ticket_price: Joi.number().required(),
    //   event_highlight: Joi.string().required(),
    //   capacity: Joi.number().required(),
    //   event_organizer_name: Joi.string().required(),
    //   event_organizer_email: Joi.string().required(),
    //   event_organizer_pnumber: Joi.number().required(),
    //   type: Joi.string()
    // });
    const email_pattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!email_pattern.test(event.event_organizer_email)) {
      errorresponse(res,400,"Invalid Email Format");
    }
    const phonenumber_pattern = /^\d{10}$/;
    if (!phonenumber_pattern.test(event.event_organizer_pnumber)) {
      errorresponse(res,400,"Invalid Phone Number");
    }
    if (newEvent.event_start_date > newEvent.event_end_date) {
      errorresponse(res,400,"Start Date should be less than End Date");
    }

    let hr1 = parseInt(event.start_time.split(":")[0]);
    let hr2 = parseInt(event.end_time.split(":")[0]);
    let min1 = parseInt(event.start_time.split(":")[1]);
    let min2 = parseInt(event.end_time.split(":")[1]);
    if (hr1 > hr2) {
      errorresponse(res,400,"Start Time should be less than End Time");
    }
    if (hr1 == hr2 && min1 >= min2) {
      return res.status(200).json({
        error: "Start Time should be less than End Time",
        success: false,
      });
    }
    if (event.capacity <= 0) {
      return res
        .status(200)
        .json({ error: "Capacity should be greater than 0", success: false });
    }
    if (event.ticket_price <= 0) {
      return res.status(200).json({
        error: "Ticket Price should be greater than 0",
        success: false,
      });
    }
    if (event.type == "") {
      return res
        .status(200)
        .json({ error: "Select Membership Type", success: false });
    }
    newEvent.is_active = true;
    await newEvent.save();
    res.status(200).json({ data: newEvent, success: true });
  } catch (error) {
    res.status(409).json({ error: error.message, success: false });
  }
};

const fetchAllPostUserSide = async (req, res) => {
  expiryEventRemover();
  const user = req.params.username;
  await Event.find({
    is_active: true,
    "participate.username": { $ne: user },
    event_start_date: { $lte: new Date() },
    event_end_date: { $gte: new Date() },
  })
    .then((result) => {
      if (result.length == 0) {
        return res
          .status(200)
          .json({ error: "No Event Found", success: false });
      }
      res.status(200).json({ data: result, success: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err.message, success: false });
    });
};

const expiryEventRemover = async () => {
  let events = await Event.find();
  let today = new Date();
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].event_end_date < today &&
      parseInt(events[i].end_time.slice(0, 2)) < today.getHours() &&
      parseInt(events[i].end_time.slice(3, 5)) < today.getMinutes()
    ) {
      await Event.findOneAndUpdate(events[i]._id, { is_active: false });
    }
  }
};

const postFilter = async (req, res) => {
  expiryEventRemover();
  const { filteredFormData, uname } = req.body;
  let filter = { is_active: true, "participate.username": { $ne: uname } };
  for (let [key, value] of Object.entries(filteredFormData)) {
    if (key == "event_start_date") {
      filter["event_start_date"] = { $gte: new Date(value) };
    } else if (key == "event_end_date") {
      filter["event_start_date"] = { $lte: new Date(value) };
    } else if (key == "minprice") {
      filter["ticket_price"] = { $gte: value };
    } else if (key == "maxprice") {
      filter["ticket_price"] = { $lte: value };
    } else if (key == "type") {
      filter["type"] = value;
    } else if (key == "venue_city") {
      filter["venue_city"] = new RegExp("^" + value, "i");
    } else if (key == "clubname") {
      filter["clubname"] = new RegExp("^" + value, "i");
    }
  }
  const posts = await Event.find(filter);
  if (posts.length == 0) {
    return res.status(200).json({ error: "No Event Found", success: false });
  }
  res.status(200).json({ data: posts, success: true });
};

const postSearchByTitle = async (req, res) => {
  expiryEventRemover();
  const { title, uname } = req.body;
  const posts = await Event.find({
    is_active: true,
    "participate.username": { $ne: uname },
    event_title: new RegExp("^" + title, "i"),
  });
  if (posts.length == 0) {
    return res.status(200).json({ error: "No Event Found", success: false });
  }
  res.status(200).json({ data: posts, success: true });
};

const fetchAllFuturePostUserSide = async (req, res) => {
  expiryEventRemover();
  const {uname} = req.body;
  const posts = await Event.find({is_active: true, "participate.username": { $ne: uname }, event_start_date: { $gte: new Date() }});
  if (posts.length == 0) {
    return res.status(200).json({ error: "No Event Found", success: false });
  }
  res.status(200).json({ data: posts, success: true });
};
module.exports = {
  getAllEvent,
  createEventPost,
  fetchAllPostUserSide,
  postFilter,
  postSearchByTitle,
  fetchAllFuturePostUserSide,
};
