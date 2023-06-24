// import dependencies here
require("dotenv").config()
const express = require('express');
const app = express();
const userRouter = require("./routes/test_router");

app.use(express.json())

app.use("/routes", userRouter);

app.listen(process.env.APPLICATION_PORT, () => {
    console.log(`server running on port : ${process.env.APPLICATION_PORT}`)
});