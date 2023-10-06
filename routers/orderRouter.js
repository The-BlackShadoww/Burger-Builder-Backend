const express = require("express");
const { Orders } = require("../models/order");
const authorize = require("../middleware/authorize");

const router = express.Router();

//! This function is for placing new order
const newOrder = async (req, res) => {
    console.log(req.body);
    //! Creating order object.
    const order = new Orders(req.body);
    try {
        await order.save();
        return res.status(201).send("Order placed successfully!!");
    } catch (err) {
        return res.status(400).send("Sorry! Something went wrong!");
    }
};

//! This function is for creating the order list of a particular user or the user currently logged in.
const orderList = async (req, res) => {
    //! To get req.user._id you must call the authorize function first. Otherwise you won't get the user object which is send from authorization.js
    const orders = await Orders.find({ userId: req.user._id }).sort({
        orderTime: -1,
    });
    res.send(orders);
};

router.route("/").get(authorize, orderList).post(authorize, newOrder);

module.exports = router;
