const mongoose = require("mongoose");
const auctionNftSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        minbid: {
            type: String,
            required: true,
            trim: true,
        },
        curbid: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: String,
            required: true,
            trim: true,
        },
        img: {
            data: Buffer,
            contentType: String,
        },
        isBuy: {
            type: Boolean,
        },
        owner: {
            type: String,
            required: true,
          }
    },
    { timestamps: true }
);
module.exports = mongoose.model("AuctionNFTs", auctionNftSchema);

