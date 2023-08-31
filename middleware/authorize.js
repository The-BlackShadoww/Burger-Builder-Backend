const jwt = require('jsonwebtoken');

//! This function is for authorization.
module.exports = function (req, res, next) {
    let token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        //! If verification is successful everything send from the payload will be stored in decoded variable.
        const decoded = jwt.verify(token.split(' ')[1].trim(), process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token!')
    }
}