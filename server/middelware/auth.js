const jwt = require('jsonwebtoken')
const User = require('../model/user')
const user = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const verify = jwt.verify(token, process.env.JWTPASS)
        if (!verify) return res.send('you not user')
        const user = await User.findById({ _id: verify._id })
        req.user = user
        next()
    }
    catch (e) {
        res.send(e.message)
    }
}
const admin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return res.send('you not admin')
        next()
    }
    catch (e) {
        res.send(e.message)
    }
}
const saler = async (req, res, next) => {
    try {
        if (req.user.role !== 'saler') return res.send('you not saler')
        next()
    }
    catch (e) {
        res.send(e.message)
    }
}
module.exports = {
    user, admin, saler
}