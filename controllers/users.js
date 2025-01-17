const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const { SUCCESSFUL_REQUEST_CODE } = require("../utils/errors");
const { BadRequestError } = require("../customerrors/BadRequestError");
const { UnauthorizedError } = require("../customerrors/UnauthorizedError");
const { NotFoundError } = require("../customerrors/NotFoundError");
const { ConflictError } = require("../customerrors/ConflictError");

// BadRequestError = 400
// UnauthorizedError = 401
// ForbiddenError = 403
// NotFoundError = 404
// ConflictError = 409

const getCurrentUser = (req, res, next) => {
  console.log("getCurrentUser has run");

  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      console.log("User Found:", user);
      res.status(SUCCESSFUL_REQUEST_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  console.log("updateprofile has run");

  const userId = req.user._id;
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(SUCCESSFUL_REQUEST_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      next(err);
    });
};

const userLogIn = (req, res, next) => {
  console.log("userLogin has run");

  const { email, password } = req.body;
  if (!email || !password) return next(new BadRequestError("Bad request"));
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("userLogIn controller has run", user);

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(SUCCESSFUL_REQUEST_CODE).send({
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        next(new UnauthorizedError("Invalid email or password"));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        console.log("User exists:", existingUser);
        throw new ConflictError("This email already exists");
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
      if (err.message === "This email already exists" || err.code === 11000) {
        next(new ConflictError("This email already exists"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Error validating credentials"));
      }
      next(err);
    });
};

module.exports = {
  userLogIn,
  createUser,
  getCurrentUser,
  updateProfile,
};
