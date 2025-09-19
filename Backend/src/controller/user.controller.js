const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerController(req, res) {
    const { username, email_id, password } = req.body
    const isuser = await userModel.findOne({
        $or: [
            { username: username },
            { email_id: email_id }
        ]
    })
    if (isuser) {
        return res.status(404).send("User already exist");
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
        sameSite: "None",   // ✅ prevents CSRF by not sending cookie to other domains
        maxAge: 7 * 24 * 60 * 60 * 1000 // ✅ 7 days expiry
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
            sameSite: "None",   // ✅ prevents CSRF by not sending cookie to other domains
            maxAge: 7 * 24 * 60 * 60 * 1000 // ✅ 7 days expiry
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
            httpOnly: true,   // prevent client-side access to cookie
            secure: true, // only https in prod
            sameSite: "None" // CSRF protection
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

module.exports = { registerController, loginController, logoutController };