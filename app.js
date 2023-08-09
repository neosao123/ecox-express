const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require('path');
const { connectDB } = require('./db/connect');
const routes = require("./routes/index.routes");
const app = express();
const cors = require("cors");
const fs = require("fs");
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const requestData = {
        IPAddress: req.ip,
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        timeStamp: new Date().toISOString()
    };

    res.on('finish', () => {
        const responseData = {
            status: res.statusCode,
            timeStamp: new Date().toISOString()
        };

        const logFileName = `Log_${new Date().toISOString().slice(0, 10)}.txt`;
        const logFilePath = path.join(__dirname, logFileName);
        const responseLogData =
            `\n-------------------------------------------------------------------------------------------\n
        ErrorCode: ${JSON.stringify(responseData)}\n\nResponse: ${JSON.stringify(requestData)}
        \n-------------------------------------------------------------------------------------------\n`;

        fs.appendFile(logFilePath, responseLogData, (err) => {
            if (err) {
                console.error('Error writing response log entry:', err);
            } else {
                console.log('Response log entry created successfully!');
            }
        });
    });
    next();
});

const rooms = new Set();
const roomMessages = {};

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        rooms.add(userData._id);
        socket.emit("connected");
    });
    socket.on("joinChat", (room) => {
        if (!rooms.has(room)) {
            socket.emit('roomNotFound');
            return;
        }
        socket.join(room);
        socket.emit('userJoined', room);
        console.log("User Joined Room: " + room);
    });
    socket.on("newMessage", (newMessage, room) => {
        console.log(`Received chat message in room ${room}: ${newMessage} : ${room}`);
        if (!roomMessages[room]) {
            roomMessages[room] = [];
        }
        roomMessages[room].push(newMessage);
        socket.to(room).emit("messageRecieved", newMessage, room);
    });
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

connectDB();
app.use(cors());
app.use("/uploads", express.static("./uploads"));
app.use(routes);
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));