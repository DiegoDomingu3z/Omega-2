const account = require('../models/Account')
import { dbContext } from "../db/DbContext"



const $authTokUser = async (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) {
        return res.status(401).send("FORBIDDEN")
    }
    let user = await dbContext.Account.findOne({ authToki: token }, (error, user) => {
        if (error) {
            return res.status(500).send("ERROR, COULD NOT FIND ACCOUNT")
        }
        if (!user) {
            return res.status(400).send("INVALID TOKEN")
        }
        req.body.userId = user._id
        next()
    });
}

module.exports = $authTokUser
