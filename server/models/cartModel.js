const mongoose = require("mongoose");

var cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    priceAfterDiscount: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
