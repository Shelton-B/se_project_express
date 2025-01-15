const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const { errors } = require("celebrate");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
