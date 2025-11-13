const express = require('express')
const { registerController, loginController,logoutController,update_controller } = require("../controller/user.controller")
const authUser= require('../middleware/auth.middleware')
const router = express.Router()

// Return authenticated user info (used by frontend to check auth)
router.get('/main', authUser, (req, res) => {
    // Return user object (avoid sending password)
    const user = req.user?.toObject ? req.user.toObject() : req.user
    if (user && user.password) delete user.password
    res.json({ user })
})

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.put("/update-profile",update_controller );


module.exports = router
