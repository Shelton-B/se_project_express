const express = require("express");

const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;
const cors = require("cors");
const routes = require("./routes/index");

// const { createUser, userLogIn } = require(".//controllers/users");

app.use(express.json());

// app.post("/signin", userLogIn);
// app.post("/signup", createUser);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// 8. Remove the hardcoded user object

// app.use((req, res, next) => {
//   req.user = {
//     _id: "",
//   };
//   next();
// });

app.use(routes);
app.use(cors());

app.listen(PORT, () => {});
