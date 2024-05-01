const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 9004;
const cors = require("cors");
const connectDB = require("./db");
const userRoute = require("./routes/user.route");
const organisationRoute = require("./routes/organisation.route");
const eventRoute = require("./routes/event.route");

connectDB();

app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use("/organisation", organisationRoute);
app.use("/event", eventRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
