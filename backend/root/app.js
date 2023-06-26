// import dependencies here
import dotenv from "dotenv"
dotenv.config()
import express from 'express';
const app = express();
import landlordRouter from "./routes/landlord_router.js";
import buildingRouter from "./routes/building_router.js";

app.use(express.json())

app.use("/routes/landlord", landlordRouter);
app.use("/routes/building", buildingRouter);

app.listen(process.env.APP_PORT, () => {
    console.log(`server running on port : ${process.env.APP_PORT}`)
});