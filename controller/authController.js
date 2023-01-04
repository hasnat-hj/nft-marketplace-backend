const bcrypt = require("bcrypt");
const User = require("../models/User");
const VerifyUser = require("../middleware/verifyToken");
const { generateToken } = require("../utils/ jwt");
const sendSms = (value) => {
  return value;
};

const register = async (req, res) => {
  const newUser = new User({
    ...req.body,
  });
  try {
    const verifyUser = await VerifyUser.findOne({
      username: req.body.username,
    }).lean();
    if (verifyUser && verifyUser.code != req?.body?.code) {
      return res.status(402).send({ message: "Please enter a valid code" });
    } else {
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      newUser.password = await bcrypt.hash(newUser.password, salt);
      console.log("new User", newUser);
      let user = await newUser.save();
      const { password, ...otherUserInfo } = user._doc;
      res.status(200).send({ status: 200, data: otherUserInfo });
    }
  } catch (error) {
    console.log("err", error);
    if (error?.code == 11000) {
      // Duplicate username

      let keys = Object.keys(error.keyPattern);

      return res
        .status(422)
        .send({ status: 422, message: `${keys[0]} already taken` });
    }

    // Some other error
    else {
      console.log("err", error);
      //   res.status(500).send({status:500,error})
      return res
        .status(422)
        .send({ status: 422, message: error?.message || error });
    }
  }
};
const sendVerificationCode = async (req, res) => {
  let code = Math.floor(Math.random() * 90000) + 10000;
  const newUser = new VerifyUser({
    ...req.body,
    code,
  });
  try {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    newUser.password = await bcrypt.hash(newUser.password, salt);
    console.log("new User", newUser);

    let sms = await sendSms(
      req?.body?.phoneNumber,
      `Your Verification Code is ${code}`
    );

    if (sms?.code == 21211) {
      res.status(400).send({
        message: `The 'To' number ${req.body.phoneNumber} is not a valid phone number.`,
        detail: sms,
      });
    } else {
      let user = await newUser.save();
      const { password, ...otherUserInfo } = user._doc;

      res.status(200).send({ status: 200, msg: `Your code is:${code}` });
    }
  } catch (error) {
    console.log("err", error);
    if (error?.code == 11000) {
      // Duplicate username

      let keys = Object.keys(error.keyPattern);

      return res
        .status(422)
        .send({ status: 422, message: `${keys[0]} already taken` });
    }

    // Some other error
    else {
      console.log("err", error);
      //   res.status(500).send({status:500,error})
      return res
        .status(422)
        .send({ status: 422, message: error?.message || error });
    }
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).lean();

    !user && res.status(401).send({ status: 401, message: "No User found" });

    if (user) {
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validatePassword) {
        let { password, ...others } = user;
        console.log("logs-----", user);
        var token = generateToken(others);
        console.log("token", token);
        res.status(200).send({ status: 200, data: { ...others, token } });
      } else {
        res.status(401).send({ status: 401, message: "Invalid Password" });
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ status: 500, error });
  }
};
module.exports = {
  register,
  login,
  sendVerificationCode,
};
