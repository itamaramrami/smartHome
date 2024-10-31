import express from "express";
import contactDb from "./db/contactDb.js";
import dotenv from "dotenv";
import HouseRoutes from "./routes/House.route.js";
dotenv.config();
const app = express()
const PORT = process.env.PORT  || 5000
app.use(express.json())
app.use("/api/House", HouseRoutes)


app.listen(PORT, () => {
    contactDb()
    console.log('server is rennig on fort:',PORT)
})