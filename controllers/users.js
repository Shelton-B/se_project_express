const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const {
  DATA_NOT_FOUND_CODE,
  SUCCESSFUL_REQUEST_CODE,
  INVALID_DATA_CODE,
  DEFAULT_ERROR_CODE,
  UNAUTHORIZED_STATUS_CODE,
  CONFLICT_ERROR_CODE,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  console.log("getCurrentUser has run");

  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      console.log("User Found:", user);
      res.status(SUCCESSFUL_REQUEST_CODE).send(user);
    })
    .catch((err) => {
      console.error("Error:", err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DATA_NOT_FOUND_CODE)
          .send({ message: "User not found" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

// verify getCurrentUser is executing correctly

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(SUCCESSFUL_REQUEST_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_CODE)
          .send({ message: "Validation error" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DATA_NOT_FOUND_CODE)
          .send({ message: "User not found" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const userLogIn = (req, res) => {
  console.log("userLogin has run");

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(INVALID_DATA_CODE).send({ message: "Bad request" });

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("userLogIn controller has run", user);

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(SUCCESSFUL_REQUEST_CODE).send({ token });
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .send({ message: "Invalid email or password" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        console.log("User exists:", existingUser);
        throw new Error("This email already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) => {
      res.status(SUCCESSFUL_REQUEST_CODE).send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      console.error("Error:", err);

      if (err.message === "This email already exists" || err.code === 11000) {
        return res
          .status(CONFLICT_ERROR_CODE)
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

// >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<< \\

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

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(SUCCESSFUL_REQUEST_CODE).send(users))
//     .catch(() =>
//       res
//         .status(DEFAULT_ERROR_CODE)
//         .send({ message: "An error has occurred on the server" }),
//     );
// };

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(SUCCESSFUL_REQUEST_CODE).send(user))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res.status(INVALID_DATA_CODE).send({ message: err.message });
//       }

//       return res
//         .status(DEFAULT_ERROR_CODE)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

module.exports = {
  // createUsers,
  // getUsers,
  // getUser,
  userLogIn,
  createUser,
  getCurrentUser,
  updateProfile,
};
