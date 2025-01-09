const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("user not found");
        return Promise.reject(new Error("Invalid email or password"));
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          console.error("Invalid email or password");

          return Promise.reject(new Error("Invalid email or password"));
        }
        console.log("user login successful");
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
