const express = require("express");
const router = express.Router();
const {
  getAllEvent,
  createEventPost,
  fetchAllPostUserSide,
  postFilter,
  postSearchByTitle,
  fetchAllFuturePostUserSide
} = require("../controllers/event.controller");

router.get("/", getAllEvent);
router.post("/createeventpost/", createEventPost);
router.post("/postforuser/:username", fetchAllPostUserSide);
router.post("/postfilter/", postFilter);
router.post("/postsearchbytitle/", postSearchByTitle);
router.post("/fetchallfuturepostforuser/", fetchAllFuturePostUserSide);

module.exports = router;
