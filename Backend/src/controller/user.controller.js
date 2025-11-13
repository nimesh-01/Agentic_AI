const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerController(req, res) {
    const { username, email_id, password } = req.body
    const existingUsername = await userModel.findOne({ username: username });
    const existingEmail = await userModel.findOne({ email_id: email_id });

    if (existingUsername || existingEmail) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username: username,
        email_id: email_id,
        password: hashedPassword
    })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true,       // ✅ cannot be accessed via JS (protects from XSS)
        secure: true,         // ✅ cookie only sent over HTTPS
        sameSite: "none",   // ✅ prevents CSRF by not sending cookie to other domains
    })

    res.status(200).json({
        msg: "user Regisered successfully",
        user
    })
}
async function loginController(req, res) {
    const { email_id, password } = req.body;
    const isUserExist = await userModel.findOne({ email_id })
    if (!isUserExist) res.status(401).json({ msg: "User Not found" })
    const valid = await bcrypt.compare(password, isUserExist.password)
    if (valid) {
        const token = jwt.sign({ id: isUserExist._id }, process.env.JWT_SECRET)
        res.cookie('token', token, {
            httpOnly: true,       // ✅ cannot be accessed via JS (protects from XSS)
            secure: true,         // ✅ cookie only sent over HTTPS
            sameSite: "none",   // ✅ prevents CSRF by not sending cookie to other domains
        })
        return res.status(200).json({
            msg: "User Loged in",
            isUserExist
        })
    } res.status(401).json({
        msg: "Incorrect password"
    })
}

async function logoutController(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,       // ✅ cannot be accessed via JS (protects from XSS)
            secure: true,         // ✅ cookie only sent over HTTPS
            sameSite: "none",   // ✅ prevents CSRF by not sending cookie to other domains
        });

        return res.status(200).json({
            msg: "User logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error logging out",
            error: error.message
        });
    }
}
async function update_controller(req, res) {
    try {
        const { userId, username, email_id, password } = req.body;

        const updateData = { username, email_id };

        // if password changed
        if (password && password.trim().length > 0) {
            const hashed = await bcrypt.hash(password, 10);
            updateData.password = hashed;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(400).json({ success: false, msg: "User not found" });
        }

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
}
module.exports = { registerController, loginController, logoutController,update_controller };