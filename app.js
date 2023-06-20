require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
app.use(express.json()); //to convert json to javascript objects

/** 
app.use((req, res, next) => {
  console.log(req.body); // Log the request body
  next(); // Call next to pass control to the next middleware/route handler
});
*/

app.use("/api/users", userRouter);

app.get("/api", (req, res) => {
  res.json({
    sucess: 1,
    message: "This is rest api working",
  });
});
app.listen(process.env.APP_PORT, () => {
  console.log("Server is working on port 3000");
});
