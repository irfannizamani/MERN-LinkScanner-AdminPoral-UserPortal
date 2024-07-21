const { Admin } = require('../models/AdminModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        return res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching admin data:", error);
        return res.status(500).json({ message: "Error fetching admin data" });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const admin = await Admin.findOne({ userName });
        if (!admin) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
       
        const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Login error" });
    }
};
