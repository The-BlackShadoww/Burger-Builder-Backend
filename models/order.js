const { Schema, model } = require("mongoose");

//! Order Schema
const orderSchema = Schema({
    userId: Schema.Types.ObjectId,
    ingredients: [{ type: { type: String }, amount: Number }],
    customer: {
        address1: String,
        address2: String,
        city: String,
        postcode: String,
        country: String,
        phone: String,
        paymentType: String,
    },
    price: Number,
    orderTime: { type: Date, default: Date.now },
});

module.exports.Orders = model("Order", orderSchema);
