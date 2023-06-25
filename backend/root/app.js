// import dependencies here
require("dotenv").config()
const express = require('express');
const app = express();
const landlordRouter = require("./routes/landlord_router");
const buildingRouter = require("./routes/building_router");

app.use(express.json())

app.use("/routes/landlord", landlordRouter);
app.use("/routes/building", buildingRouter);

app.listen(process.env.APPLICATION_PORT, () => {
    console.log(`server running on port : ${process.env.APPLICATION_PORT}`)
});