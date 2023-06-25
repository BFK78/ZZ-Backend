//Import Module
import express, { Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { socketHandler } from "./sockets";

dotenv.config();

const PORT = process.env.PORT || 8888;
const app = express();
const server = http.createServer(app);

//Cors configuration
const corsOption = {
  origin: "http://localhost:3000",
};

const io = new Server(server, {
  cors: corsOption,
});

//Socket Connection
io.on("connection", (socket: Socket) => {
  console.log("Successfully connected with the client.");
  socketHandler(socket, io);
});

//Middlewares
app.use(cors(corsOption));

//Default router
app.get("/", (req: Request, res: Response) => {
  res.send("Default router!!");
});

//Listening port
server.listen(PORT, () => {
  console.log("Server is listening on the PORT: " + PORT);
});
