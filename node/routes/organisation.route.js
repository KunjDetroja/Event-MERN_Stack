const express = require("express");
const router = express.Router();
const {
  getAllOrganisation,
  createOrganisation,
  checkOrganisation,
  allMembershipType,
  allClubname,
} = require("../controllers/organisation.controller");

router.get("/", getAllOrganisation);
router.post("/organizationregistration/", createOrganisation);
router.post("/organizationlogin/", checkOrganisation);
router.get("/allmembershiptype/", allMembershipType);
router.get("/clubnames/", allClubname);

module.exports = router;
