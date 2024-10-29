const User = require("../models/users");

const {
  DATA_NOT_FOUND_CODE,
  SUCCESSFUL_REQUEST_CODE,
  INVALID_DATA_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

const createUsers = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(SUCCESSFUL_REQUEST_CODE).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_CODE).send(users))
    .catch(() =>
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" }),
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESSFUL_REQUEST_CODE).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }

      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUsers, getUsers, getUser };
