const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { hashSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required!"],
      trim: true
    },
    firstName: {
      type: String,
      required: [true, "FirstName is required!"],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "LastName is required!"],
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [0, "Password need to be longer"] // not required really
    }
  },
  { timestamps: true }
);

AdminSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this._hashpassword(this.password);
  }
  return next();
});

AdminSchema.methods = {
  _hashpassword(password) {
    return hashSync(password);
  },
  authenticateAdmin(password) {
    return compareSync(password, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id
      },
      "thisisalamesecret",
      { expiresIn: "2 hours" }
    );
  },
  toAuthJSON() {
    return {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      token: `JWT ${this.createToken()}`
    };
  },
  toJSON() {
    // this is a inbuilt function and we are overriding it
    // this is generally used when res.json is used or something like that(populate by another object)
    return {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    };
  }
};

module.exports = mongoose.model("admin", AdminSchema);
