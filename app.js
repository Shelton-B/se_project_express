const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const routes = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
