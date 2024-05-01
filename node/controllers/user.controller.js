const User = require("../models/user.model");
const Event = require("../models/event.model");

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users, { success: true });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};

const checkUser = async (req, res) => {
  try {
    let { clubname, username, password } = req.body;
    if (clubname == "" || clubname == null || clubname == "None") {
      clubname = null;
    }
    const user = await User.findOne({
      username: username,
      password: password,
      clubname: clubname,
    });
    if (user) {
      user.is_login = true;
      res.status(200).json({ data: user, success: true });
    } else {
      res
        .status(400)
        .json({
          error: "Invalid Username , Password and Clubname",
          success: false,
        });
    }
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

const createUser = async (req, res) => {
  try {
    const user = req.body;
    const email_pattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!email_pattern.test(user.email)) {
      return res
        .status(200)
        .json({ error: "Invalid Email Format", success: false });
    }
    const phonenumber_pattern = /^\d{10}$/;
    if (!phonenumber_pattern.test(user.phonenumber)) {
      return res
        .status(200)
        .json({ error: "Invalid Phone Number", success: false });
    }
    const allUser = await User.find();
    for (let i = 0; i < allUser.length; i++) {
      if (allUser[i].username == user.username) {
        return res
          .status(200)
          .json({ error: "Username Already Exists", success: false });
      }
    }
    user.is_login = true;
    const newUser = new User(user);
    await newUser.save();
    res.status(200).json({ data: newUser, success: true });
  } catch (error) {
    res.status(409).json({ error: error.message, success: false });
  }
};


module.exports = { getAllUser, checkUser, createUser };
