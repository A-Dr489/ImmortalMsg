require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {origin: [process.env.ORIGIN], credentials: true}
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const protectedRouter = require("./routes/protectedRouter.js");
const socketHandler = require("./sockets/socketHandler.js")
const { authenticateSocket } = require('./utills/middlewares.js');

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.send("Handled by: " + process.env.HOSTNAME);
})
app.use("/protect", protectedRouter);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use(authenticateSocket);

socketHandler(io);

const PORT = Number(process.env.PORT);
server.listen(PORT, () => {
    console.log("Server is listening to Port: " + PORT);
})