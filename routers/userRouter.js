const express = require("express");
const bcrypt = require("bcrypt");
const { Users, validate } = require("../models/user");
const _ = require("lodash");

const router = express.Router();

//! This function is for generating a new user. (Sign-up)
const newUser = async (req, res) => {
    //! Check if any error exits in user input or not.
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //! Creating user object
    let user = await Users.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Account already exits");
    user = new Users(_.pick(req.body, ["name", "email", "password"]));

    //! Password Hashing
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //! Generate a token for new user
    const token = user.genJWT();

    //! Save the information given by the user in mongoDB database.
    const result = await user.save();

    //! When a new user is created this object will be send.
    return res.status(201).send({
        token: token,
        user: _.pick(result, ["_id", "name", "email"]),
    });
};

//! This function is for authenticating user (Log-in)
const authUser = async (req, res) => {
    //! First check if the email already exits or not.
    let user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    //! compare password
    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser) return res.status(400).send("Invalid email or password");

    //! If he is a valid user generate a new token for him
    const token = user.genJWT();

    //! Then send response as object.
    res.send({
        token: token,
        user: _.pick(user, ["_id", "name", "email"]),
    });
};

//! If anyone request in this route he can create a new user.
router.route("/").post(newUser);

//! If anyone make request in this route he can login after authentication.
router.route("/auth").post(authUser);

module.exports = router;
