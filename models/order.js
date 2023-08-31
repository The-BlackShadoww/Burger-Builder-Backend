const { Schema, model } = require('mongoose');

//! Order Schema
const orderSchema = Schema({
    userId: Schema.Types.ObjectId, //! getting the user id which is created by mongoDB in the collection.
    ingredients: [{ type: { type: String }, amount: Number }],
    customer: {
        deliveryAddress: String,
        phone: String,
        paymentType: String,
    },
    price: Number,
    orderTime: {type: Date, default: Date.now}
})

module.exports.Orders = model('Order', orderSchema);

