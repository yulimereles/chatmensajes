const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");

app.use(cors());

//espacio en memoria para almacenar los mensages
const messageHistory = [];
//variable para rastrear el estado de escritura del usuario
const UserEscribiendo = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("escribir", (isTyping, username) => {
    UserEscribiendo[username] = isTyping;
    // Emite un evento para notificar a todos los clientes sobre el estado de escritura del usuario.
    io.emit("escribiendo", UserEscribiendo);
  });

  // Envía el historial de mensajes al nuevo usuario
  socket.emit("message history", messageHistory);

  socket.on("chat message", (msg, username) => {
    const message = { username, text: msg };
    messageHistory.push(message);
    io.emit("chat message", message);
  });
  socket.on("disconnect", () => {
    console.log("Usuario Desconectado");
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});