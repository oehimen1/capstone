const express = require("express")
const Settings = require("../models/settings")
const router = express.Router()
const security = require("../middleware/security")


router.put("/", security.requireAuthenticatedUser, async (req, res, next)=>{
    try {
        const user = res.locals.user
        console.log(user)
        const settings = await Settings.updateInfo({ user, settings: req.body })
        return res.status(200).json({ settings })
    } catch (err) {
        next(err)
    }
})



module.exports = router