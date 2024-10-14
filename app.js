const express = require("express");
const mongoose = require("mongoose");
const app = express();
const indexRouter = require("./routes/index");
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("This is working");
});
