const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async function Populate() {
  try {
    // const user = new User({
    //   name: "Alex",
    //   email: "1@example.com",
    //   password: "12345678",
    //   isSuperAdmin: true,
    // });
    // await user.save();

    console.log("created");
  } catch (err) {
    return console.log("error", err);
  }
};
