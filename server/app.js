require("dotenv").config();
require("./helpers/connect_redis");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5000;
const db = require("./config/db");
db.connect();
const IndexRouter = require("./routers/index");
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("controllers/public"));

server.listen(PORT, () => {
    console.log(`Server on in port : ${PORT}`);
});

app.use((req, res, next) => {
    io.req = req;
    req.io = io;
    next();
});
require("./socket")(io);
app.use("/", IndexRouter);

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// Error handler function
app.use((err, req, res, next) => {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;

    // response to client
    return res.status(status).json({
        error: {
            message: error.message,
        },
    });
});
