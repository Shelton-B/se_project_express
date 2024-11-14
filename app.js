const express = require("express");
const mongoose = require("mongoose");

const app = express();

const { PORT = 3001 } = process.env;

const { createUser, userLogIn } = require(".//controllers/users");

app.use(express.json());

app.post("/signin", userLogIn);
app.post("/signup", createUser);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes/index");

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {});
