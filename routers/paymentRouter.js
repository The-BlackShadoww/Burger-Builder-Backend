const router = require("express").Router();
const SSLCommerz = require("ssl-commerz-node");
const PaymentSession = SSLCommerz.PaymentSession;
const { Payment } = require("../models/payment");
const { Profile } = require("../models/profile");
const { Orders } = require("../models/order");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");
const authorize = require("../middleware/authorize");

const ipn = async (req, res) => {
    const payment = new Payment(req.body);

    await payment.save();

    return res.status(200).send("IPN");
};

const initPayment = async (req, res) => {
    try {
        const userId = req.user._id;
        const price = req.query.price;
        console.log("this is the price => ", price);
        const profile = await Profile.findOne({ user: userId });
        const { address1, address2, city, state, postcode, country, phone } =
            profile;

        const total_amount = price;
        console.log("This is total amount=>", total_amount);

        const total_item = 1;

        const tran_id =
            "_" +
            Math.random().toString(36).substr(2, 9) +
            new Date().getTime();

        const payment = new PaymentSession(
            true,
            process.env.SSLCOMMERZ_STORE_ID,
            process.env.SSLCOMMERZ_STORE_PASSWORD
        );

        //! Set the urls
        payment.setUrls({
            success:
                "https://bohubrihi-burger-builder-backend-app.onrender.com/payment/success",
            fail: "yoursite.com/fail",
            cancel: "yoursite.com/cancel",
            ipn: "https://bohubrihi-burger-builder-backend-app.onrender.com/payment/ipn",
        });

        //! Set order details
        payment.setOrderInfo({
            total_amount: total_amount,
            currency: "BDT",
            tran_id: tran_id,
            emi_option: 0,
        });

        //! Set customer info
        payment.setCusInfo({
            name: req.user.name,
            email: req.user.email,
            add1: address1,
            add2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country,
            phone: phone,
            fax: phone,
        });

        //! Set shipping info
        payment.setShippingInfo({
            method: "Courier",
            num_item: total_item,
            name: req.user.name,
            add1: address1,
            add2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country,
        });

        //! Set Product Profile
        payment.setProductInfo({
            product_name: "Bohubrihi Burger Builder",
            product_category: "General",
            product_profile: "general",
        });

        response = await payment.paymentInit();

        // let order = new Order({
        //     cartItems: cartItems,
        //     user: userId,
        //     transaction_id: tran_id,
        //     address: profile,
        // });

        // if (response.status === "SUCCESS") {
        //     order.sessionKey = response["sessionkey"];
        //     await order.save();
        // }

        return res.status(200).send(response);
    } catch (err) {
        console.log(err);
    }
};

router.route("/").get(authorize, initPayment);
router.route("/ipn").post(ipn);
// router.route("/success").post(paymentSuccess);

module.exports = router;
