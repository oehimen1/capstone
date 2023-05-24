const express = require("express")
const newp = require("../models/newp")
const router = express.Router()
const security = require("../middleware/security")


router.post("/", security.requireAuthenticatedUser, async (req, res, next)=>{
    try {
        const user = res.locals.user
        const settings = await newp.updateInfo({user,settings: req.body})
        return res.status(200).json({ settings })
    } catch (err) {
        next(err)
    }
})

module.exports = router