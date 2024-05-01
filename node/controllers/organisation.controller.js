const { Organisation } = require("../models/organisation.model");
const User = require("../models/user.model");

const getAllOrganisation = async (req, res) => {
  try {
    const organisations = await Organisation.find();
    if (organisations.length > 0) {
      res.status(200).json({ data: organisations, success: true });
    } else {
      res.status(200).json({ error: "No Organisation Found", success: false });
    }
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

const checkOrganisation = async (req, res) => {
  try {
    const { username, password } = req.body;
    const organisation = await Organisation.findOne({
      $and: [{ username: username }, { password: password }],
    });
    if (organisation) {
      organisation.is_login = true;
      res.status(200).json({ data: organisation, success: true });
    } else {
      res
        .status(200)
        .json({ error: "Invalid Username and Password", success: false });
    }
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

const createOrganisation = async (req, res) => {
  try {
    const organisation = req.body;
    if (organisation.members.length == 0) {
      return res
        .status(200)
        .json({ error: "No Members Found", success: false });
    }
    const email_pattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!email_pattern.test(organisation.email)) {
      return res
        .status(200)
        .json({ error: "Invalid Email Format", success: false });
    }
    const phonenumber_pattern = /^\d{10}$/;
    if (!phonenumber_pattern.test(organisation.phonenumber)) {
      return res
        .status(200)
        .json({ error: "Invalid Phone Number", success: false });
    }
    const allOrganisation = await Organisation.find();
    for (let i = 0; i < allOrganisation.length; i++) {
      if (allOrganisation[i].clubname == organisation.clubname) {
        return res
          .status(200)
          .json({ error: "Clubname Already Exists", success: false });
      }
    }
    let members = organisation.members;
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      let user = await User.findOne({
        $and: [
          { username: member.username },
          { clubname: organisation.clubname },
        ],
      });
      if (user) {
        return res.status(200).json({
          error: "Your Members Username Already Exists",
          success: false,
        });
      }
    }
    organisation.members = [];
    for (let i = 0; i < members.length; i++) {}
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      member.is_login = false;
      member.is_active = true;
      const newUser = new User(member);
      await newUser.save();
      organisation.members.push(newUser._id);
    }
    const newOrganisation = new Organisation(organisation);
    newOrganisation.is_active = true;
    await newOrganisation.save();
    res.status(200).json({ data: newOrganisation, success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

const allMembershipType = async (req, res) => {
  try {
    memberType = [];
    const organisations = await Organisation.find();
    for (let i = 0; i < organisations.length; i++) {
      for (let j = 0; j < organisations[i].membertype.length; j++) {
        if (memberType.includes(organisations[i].membertype[j].type)) {
          continue;
        } else {
          memberType.push(organisations[i].membertype[j].type);
        }
      }
    }
    res.status(200).json({ data: memberType, success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

const allClubname = async (req, res) => {
  try {
    clubname = [];
    const organisations = await Organisation.find();
    for (let i = 0; i < organisations.length; i++) {
      clubname.push(organisations[i].clubname);
    }
    res.status(200).json({ data: clubname, success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
};

module.exports = {
  getAllOrganisation,
  createOrganisation,
  checkOrganisation,
  allMembershipType,
  allClubname,
};
