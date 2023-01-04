const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema(
  {
    collectionId: {
      type: String,
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    events: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ACTIVITES", activitySchema);