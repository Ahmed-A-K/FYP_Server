//req, access data from front end .
//res, acces data from backend and send to front-end.
//npm start = nodemon app.js in scripts of package.json.
//nodemon package allows us not to restart the server again if changes are made to our app.js

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //it is asynchronous task so then callback function will run once we connect to DataBase.
    console.log("our database is connected");
  })
  .catch((err) => console.log(err.message));
