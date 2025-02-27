require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var deliveriesRouter = require("./routes/deliveries");
var paymentsRouter = require('./routes/payments');
var reviewsRouter = require("./routes/reviews");

require("./models/connection");

var app = express();

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/deliveries', deliveriesRouter);
app.use('/payments', paymentsRouter);
app.use("/reviews", reviewsRouter);

module.exports = app;
