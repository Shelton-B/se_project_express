const express = require("express");

const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;
const cors = require("cors");
const routes = require("./routes/index");

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(routes);
app.use(cors());

app.listen(PORT, () => {});
