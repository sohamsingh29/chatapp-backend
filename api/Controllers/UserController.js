const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.getUser = async () => {
  return await User.find({});
};
exports.addUser = async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newUser = new User({ ...user, password: hashedPassword });
    return await newUser.save();
  } catch (err) {
    throw new Error(err);
  }
};

exports.userLogin = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User Not present");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Your passowrd is incorrect");
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    return { token, user };
  } catch (err) {
    throw new Error(err);
  }
};

exports.searchUser = async ({ email }) => {
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Entered User not Found");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};
