const express = require("express");
const cors = require("cors");
const app = express();

// const multer = require("multer");
// const upload = multer();

// Router path
const authRoute = require("./routes/auth");
const registerRoute = require("./routes/register");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");
const profileRoute = require("./routes/profile");
const usersRoute = require("./routes/users");
const friendsRoute = require("./routes/friends");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

// DB connection
const connectDB = require("./config/db");
connectDB();

// Body parser
app.use(express.urlencoded({ extended: true }));
// Parse application/json
app.use(express.json());
// Parse multipart/form-data
// app.use(upload.array());

app.use(cors());
// Init Route

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api/auth", authRoute);
app.use("/api/register", registerRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/profile", profileRoute);
app.use("/api/users", usersRoute);
app.use("/api/friends", friendsRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server is now running on PORT: ${PORT}`)
);

// const io = require("socket.io")(server, {
//   cors: {
//     origins: ["oneschool.co:8080"],
//   },
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return users.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   console.log("Chat Connected");
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//   });
//   socket.on("sendText", ({ text, senderId, receiverId }) => {
//     const user = getUser(receiverId);
//     io.to(user.socketId).emit("getText", { senderId, text });
//   });
//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });
