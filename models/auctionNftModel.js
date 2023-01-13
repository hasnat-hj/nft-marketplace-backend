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
            type: String,
            required: true,
        },
        isBuy: {
            type: Boolean,
        },
        creator: {
            type: String,
            required: true,
          },
        owner: {
            type: String,
            required: true,
          }
        
    },
    { timestamps: true }
);

module.exports.AuctionNFTs = mongoose.model("AuctionNFTs", auctionNftSchema);

const auctionNftOffers = new mongoose.Schema(
    {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "AuctionNFTs"
         
        },
        address: {
            type: String,
                
        },
        bid: {
            type: Number,
            required: true,
            trim: true,
        },
        
    },
    { timestamps: true }
);


module.exports.AuctionOffers = mongoose.model("AuctionNFTOffers", auctionNftOffers);


