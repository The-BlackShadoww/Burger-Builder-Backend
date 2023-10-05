const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
});

//! Token generating
userSchema.methods.genJWT = function () {
    //! This will also be send as request payload.
    const token = jwt.sign(
        { _id: this._id, email: this.email, name: this.name },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3h" }
    );
    return token;
};
//! validating user input by joi
const validateUser = (user) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
};

module.exports.Users = model("User", userSchema);
module.exports.validate = validateUser;

//todo ------------ Original ---------------

// const { Schema, model } = require('mongoose');
// const jwt = require('jsonwebtoken');
// const joi = require('joi')

// const userSchema = Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         minlength: 5,
//         maxlength: 255,
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 5,
//         maxlength: 1024,
//     },
// })

// //! Token generating
// userSchema.methods.genJWT = function () {
//     //! This will also be send as request payload.
//     const token = jwt.sign(
//         { _id: this._id, email: this.email },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: "3h" }
//     )
//     return token;
// }
// //! validating user input by joi
// const validateUser = user => {
//     const schema = joi.object({
//         email: joi.string().min(5).max(255).required().email(),
//         password: joi.string().min(5).max(255).required()
//     });

//     return schema.validate(user);
// }

// module.exports.Users = model('User', userSchema);
// module.exports.validate = validateUser;
