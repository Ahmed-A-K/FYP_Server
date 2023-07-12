//req, access data from front end .
//res, acces data from backend and send to front-end.
//npm start = nodemon app.js in scripts of package.json.
//nodemon package allows us not to restart the server again if changes are made to our app.js

const express = require("express");
require("dotenv").config();
require("./models/db");
const userRouter = require("./routes/user");
const riderRouter = require("./routes/rider");
const orderRouter = require("./routes/order");
const retailerRouter = require("./routes/retailer");
const retailerOrderRouter = require("./routes/retailerOrder");
const adminRouter = require("./routes/admin");
const walletRouter = require("./routes/wallet");
const transactionRouter = require("./routes/transaction");
const retailerWalletRouter = require("./routes/retailerWallet");
// const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     //it is asynchronous task so then callback function will run once we connect to DataBase.
//     console.log("our database is connected");
//   })
//   .catch((err) => console.log(err.message));

const User = require("./models/user"); // requiring our user objects schema

const app = express();
// //use middleware functions to capture data coming from frontend.
// app.use((req, res, next) => {
//   //next will decide if our logic will move to next step or not.
//   req.on("data", (chunk) => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

app.use(express.json());
app.use(userRouter);
app.use(riderRouter);
app.use(orderRouter);
app.use(retailerRouter);
app.use(retailerOrderRouter);
app.use(adminRouter);
app.use(walletRouter);
app.use(transactionRouter);
app.use(retailerWalletRouter);

app.get("/test", (req, res) => {
  res.send("Hello world");
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(8000, () => {
  console.log("Port is listening");
});
