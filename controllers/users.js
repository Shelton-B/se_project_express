const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  DATA_NOT_FOUND_CODE,
  SUCCESSFUL_REQUEST_CODE,
  INVALID_DATA_CODE,
  DEFAULT_ERROR_CODE,
  NEW_RESOURCE_CREATED_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const userLogIn = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(SUCCESSFUL_REQUEST_CODE).send({ token });
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED_STATUS_CODE)
        .send({ message: "Invalid email or password" });
    });
};

// const createUsers = (req, res) => {
//   const { name, avatar } = req.body;
//   User.create({ name, avatar })
//     .then((user) => res.status(SUCCESSFUL_REQUEST_CODE).send(user))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res.status(INVALID_DATA_CODE).send({ message: err.message });
//       } else {
//         res
//           .status(DEFAULT_ERROR_CODE)
//           .send({ message: "An error has occurred on the server" });
//       }
//     });
// };

const createUsers = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return Promise.reject(new Error("This email already exists"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash });
    })
    .then((newUser) => {
      res.status(SUCCESSFUL_REQUEST_CODE).send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(INVALID_DATA_CODE)
          .send({ message: "This email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
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

module.exports = { createUsers, getUsers, getUser, userLogIn };
