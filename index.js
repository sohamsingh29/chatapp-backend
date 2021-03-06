const options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};

require("dotenv").config();
const { MessageStore } = require("./stores/messageStore");
const { OnlineStore } = require("./stores/onlineStore");
const userModel = require("./models/userModel");
const express = require("express");
const app = express();
const cors = require("cors");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, options);
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const onlineUsers = new OnlineStore();
const messagesQueue = new MessageStore();

app.post("/login", async (req, res) => {
  try {
    let userData = req.body;
    console.log(userData);
    const exists = await userModel.findOne({ phone: userData.phone });
    if (exists) {
      return res
        .status(200)
        .json({ message: "Logged In Successfully!", userData: exists });
    }
    const newUser = new userModel(userData);
    const newUserData = await newUser.save();
    return res
      .status(200)
      .json({ message: "Logged In Successfully!", userData: newUserData });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Something's Wrong!" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const uid = req.params.id;
    const user = await userModel.findById(uid);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Something's Worng!" });
  }
});

app.post("/getContacts", async (req, res) => {
  try {
    const data = req.body;
    const users = await userModel.find({ phone: { $in: data.phoneNumbers } });
    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Something's Worng!" });
  }
});

io.use((socket, next) => {
  const id = socket.handshake.auth.id;
  socket._id = id;
  next();
});

io.on("connection", (socket) => {
  socket.join(socket._id);
  onlineUsers.onOnline(socket._id);
  while (
    onlineUsers.isOnline(socket._id) &&
    messagesQueue.hasMessage(socket._id)
  ) {
    socket.emit("new message", messagesQueue.getMessage(socket._id));
  }

  socket.on("send message", (message) => {
    if (onlineUsers.isOnline(message.to)) {
      io.to(message.to).to(socket._id).emit("new message", message);
    } else {
      io.to(socket._id).emit("new message", message);
      messagesQueue.putMessage(message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.onOffline(socket._id);
  });
});

httpServer.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
