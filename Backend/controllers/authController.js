const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const signToken = require('../utils/jwt');

// Validation error formatter
function checkValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
        return false;
    }
    return true;
}

const adminLogin = async (req, res) => {
    try {
        if (!checkValidation(req, res)) return;
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username: username.toLowerCase() });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = signToken(admin);
        res.json({ token, username: admin.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message
         });
    }
}


module.exports = {
    adminLogin,
    checkValidation
}; 