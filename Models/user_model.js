const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// hash user password pre hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    console.log("error in hash password in user schema : ", error);
    next(error);
  }
});

// checking password login user
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
