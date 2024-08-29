const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const path = require("path");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
require("dotenv").config();
const http = require("http");
const io = require("socket.io");
const { connect } = require("./db/connect");
connect();

app.use(bodyParser.json());
// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

app.options("*", cors());
app.use(cors());


const socketApp = express();

const server = http.createServer(socketApp);

const socketIo = io(server, {
  cors: {
    origin: "*",
  },
});

app.use((req, res, next) =>{
  if (req.path.includes('/api/file/generate')) {
    console.log(req.path, 'req.path')
    req.socket = socketIo;
  }
  next();
});

app.use("/api", routes);

app.use("*", (req, res) => {
  console.log('render fe');
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

socketIo.on('connection', (socket) => {
  console.log('a user connected');
})

server.listen(5500, () => console.log('Listening socket on port 5500' ));

