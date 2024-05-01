const express = require("express");
const {
  getAllUser,
  checkUser,
  createUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/", getAllUser);
router.post("/userlogin/", checkUser);
router.post("/userregistration/", createUser);

// router.get('/:id', (req, res) => {
//     const id = req.params.id;
//     res.send('Received a GET request on the /about route');
// });

// router.post('/', (req, res) => {
//     // Handle POST request for the root route
//     res.send('Received a POST request');
// });

// Export the router
module.exports = router;
