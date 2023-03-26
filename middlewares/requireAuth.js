const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const dotenv = require("dotenv").config();
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

  if (!authorization) {
    console.log("invoked no auth")
    return res.status(401).send({ error: 'You must be logged in.Middleware' });
  
  }

  const token = authorization.replace('Bearer ', '');
 
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in.Middleware' });
    }

    const { userId } = payload;

    var user = await User.findById(userId);
    if (user==null) {
      return res.status(401).send({ error: 'Invalid Token Provided' });
    }
    req.user = user;
    next();
  });
};
