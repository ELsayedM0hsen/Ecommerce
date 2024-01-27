const mongoose = require("mongoose");

var couponSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
