const router = require("express").Router();
const NFTs = require("../models/nftModel");
const USERS = require("../models/userModel");

const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: "mansoorcloud",
  api_key: "475838235114589",
  api_secret: "VqT5klF59dCMOLr58Xsnk2syymk",
});


router.post("/createNft", upload.single("nftImage"), async (req, res) => {
  console.log(req.body);
  const user = await USERS.findOne({
    address: req.body.owner
  });

  const result = await cloudinary.uploader.upload(req.file.path);
  console.log("user", user);
  if (user) {
    const saveImage = NFTs({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      img:result.secure_url,
      isBuy: false,
      owner: user._id,
      creator: user._id,
      category: req.body.category,
      saleType: req.body.saleType
    });
    saveImage
      .save()
      .then((res) => {
        console.log("image is saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
    res.send("image is saved");
  }
});

//update item
router.put("/createNft/:id", async (req, res) => {
  try {
    //find the item by its id and update it
    // NFTs.findByIdAndUpdate()
    const user = await USERS.findOne({
      address: req.body.owner
    });
    if (user) {
      const updateItem = await NFTs.findByIdAndUpdate(req.params.id, {
        isBuy: req.body.isBuy,
        owner: user._id
      });
      res.status(200).json(updateItem);
    }
  } catch (err) {
    res.json(err);
  }
});

router.post("/getNft", async (req, res, next) => {
  console.log("get nft", req.body);
  let nfts = [];
  try {
    if (req.body.isBuy && req.body.owner) {
      console.log("first call");
      const user = await USERS.findOne({
        address: req.body.owner
      });
      console.log("user", user);
      if (user) {
        nfts = await NFTs.find({
          isBuy: req.body.isBuy,
          owner: user._id
        }).populate([
          {
            path: "owner"
          },
          {
            path: "creator"
          }
        ]);
        console.log(nfts);
      }
    } else if (req.body.owner) {
      console.log("2nd call");
      const user = await USERS.findOne({
        address: req.body.owner
      });
      if (user) {
        nfts = await NFTs.find({
          owner: user._id
        }).populate([
          {
            path: "owner"
          },
          {
            path: "creator"
          }
        ]);
      }
    } else if (!req.body.isBuy && !req.body.owner) {
      console.log("3rd call");
      nfts = await NFTs.find({
        isBuy: req.body.isBuy
      }).populate([
        {
          path: "owner"
        },
        {
          path: "creator"
        }
      ]);
    }
    console.log("nft", nfts);
    if (nfts) {
      res.status(200).json(nfts);
      return;
    }
    res.status(400).json({ msg: "No data found" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
router.post("/get-auction-nfts", async (req, res, next) => {
  let nfts = [];
  try {
    console.log("first call");

    nfts = await NFTs.find({
      saleType: "auction"
    }).populate([
      {
        path: "owner"
      },
      {
        path: "creator"
      }
    ]);

    console.log("nft", nfts);
    if (nfts) {
      res.status(200).json(nfts);
      return;
    }
    res.status(400).json({ msg: "No data found" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/getNft/:id", async (req, res, next) => {
  try {
    console.log(req.params);
    const nft = await NFTs.findById(req.params.id).populate([
      {
        path: "owner"
      },
      {
        path: "creator"
      }
    ]);
    console.log("nfts: ", nft);
    if (!nft) res.status(400).json({ msg: "No data found" });
    res.status(200).json(nft);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
