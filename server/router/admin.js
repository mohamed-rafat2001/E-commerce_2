const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth.js')
const User = require('../model/user')
// get all users
router.get('/admin/allUsers', auth.user, auth.admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
        if (!users) return res.send('no users')
        res.send({ users, len: users.length })
    } catch (e) {
        res.send(e.message)
    }
})
// delete all users
router.delete('/admin/allUsers', auth.user, auth.admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).deleteMany()
        if (!users) return res.send('no users')
        res.send({ users, len: users.length })
    } catch (e) {
        res.send(e.message)
    }
})
// delete user
router.delete('/admin/dltUser/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if (!user) return res.send('no user')
        res.send(user)
    } catch (e) {
        res.send(e.message)
    }
})
// single user
router.get('/admin/User/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user) return res.send('no user')
        res.send(user)
    } catch (e) {
        res.send(e.message)
    }
})
// block user
router.patch('/admin/Block/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user.block == true) {
            user.block = true
            await user.save()
            return res.send(user)
        }
        user.block = false
        await user.save()
        res.send(user)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router