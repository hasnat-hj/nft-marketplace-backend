// import express from "express";
const express = require("express");
// import userModel from "../models/userModel";
// import USERS from "../models/userModel";
const USERS = require("../models/userModel");
const multer = require("multer");
const Userrouter = express.Router();
const fs = require("fs");

// login post
Userrouter.post("/login", async (req, res) => {
  const { username, address, balance } = req.body;
  let ExistingUsers;
  try {
    ExistingUsers = await USERS.findOne({ address });
  } catch (error) {
    return console.log(error);
  }
  let user;
  if (ExistingUsers) {
    // Set the current balance
    ExistingUsers.update({ address: address }, { $set: { balance: balance } });
    return res.status(200).json({ user });
  }
  user = new USERS({
    address,
    balance,
    username
  });
  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }
  return res.status(201).json({ user });
});



const upload = multer({ storage: multer.diskStorage({}) });

Userrouter.put(
  "/update",
  upload.any([
    { name: "coverImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      // console.log("request data ", req.body, req.files);
      let updateData = {
        username: req.body.username,
        bio: req.body.bio,
        email: req.body.email,
        links: {
          twitter: req.body.twitter,
          instagram: req.body.instagram,
          site: req.body.site
        }
      };
      if (req.files.length > 0) {
        console.log("files: ", req.files);
        req.files.forEach(function (file) {
          console.log("file: ", file);
          if (file.fieldname === "profileImage") {
            console.log("call profile");
            updateData = {
              ...updateData,
              profileImage: {
                data: fs.readFileSync(file.path),
                contentType: "image/png"
              }
            };
          }
          if (file.fieldname === "coverImage") {
            console.log("call cover");

            updateData = {
              ...updateData,
              coverImage: {
                data: fs.readFileSync(file.path),
                contentType: "image/png"
              }
            };
          }
        });
      }

      console.log(updateData);
      let user = await USERS.findOne({
        address: req.body.address
      });
      console.log("user", user);
      if (user) {
        const result = await user.update(updateData);
        console.log(result);
        res.status(200).send("User update successfully");
      } else {
        console.log("else call", user);
        res.status(404).send("User not found. Please login again");
      }
    } catch (error) {
      console.log("error: ", error);
      res.status(400).send({ error: error, data: error.message });
    }
  }
);
// Get Particular User by Address
Userrouter.get("/profile/:address", async (req, res) => {
  const address = req.params.address;
  console.log(address);
  let user;
  try {
    user = await USERS.findOne({ address: address });
    if (!user) {
      return res.status(404).json("User Not found");
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

// get all
Userrouter.get("/getAll", async (req, res) => {
  let user;
  try {
    user = await USERS.find();
  } catch (error) {
    return res
      .status(404)
      .json({ error: error, message: "Error in try catch" });
  }
  if (!user) {
    return res.status(404).json({ message: "Ueer Not found " });
  }
  return res.status(200).json({ user: user });
});

Userrouter.delete("/deleteAll", async (req, res) => {
  // const address = req.params.address;
  // // console.log(address);
  let user;
  try {
    user = await USERS.deleteMany({});
  } catch (error) {
    return res
      .status(404)
      .json({ error: error, message: "Error in try catch" });
  }
  user = await USERS.find();
  // if (!user) {
  //   return res.status(404).json({ message: "Ueer Not found " });
  // }
  return res.status(200).json({ user: user });
});

module.exports = Userrouter;
