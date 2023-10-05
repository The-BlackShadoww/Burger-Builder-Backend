const express = require("express");
// Cross Origin Resource Sharing(cors)
const cors = require("cors"); // It helps the app form by preventing the blocking of request came from other servers.
const compression = require("compression");
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");
const profileRouter = require("./routers/profileRouter");
const paymentRouter = require("./routers/paymentRouter");

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json()); //* when we submit something in post method this express.json function will automatically convert that data into json format. Without this function post request will not work.
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/profile", profileRouter);
app.use("/api/payment", paymentRouter);

module.exports = app;
