const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, config.SECRETE_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ status: 400, msg: 'Invalid token' });
    }
};
