require("dotenv").config();
const express = require("express");
const app = express();
const corsOptions = {origin: [process.env.ORIGIN], credentials: true}
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/authRouter.js");

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
    console.log("Server is listening to Port: " + PORT);
})