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
          console.error("pw error");

          return Promise.reject(new Error("Invalid email or password"));
        }
        console.log("user login successful");
        return user;
      });
    });
};

// add finduserbycridentials to schema

module.exports = mongoose.model("user", userSchema);

// console.log("userLogin has run");
// const { email, password } = req.body;
//   .then((user) => {
//     console.log(user);

//     const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     console.log(token);
//     res.status(SUCCESSFUL_REQUEST_CODE).send({ token });
//   })
//   .catch((err) => {
//     console.error("error", err);
//     res
//       .status(UNAUTHORIZED_STATUS_CODE)
//       .send({ message: "Invalid email or password" });
//   });
// };
