const express = require('express')
const User = require('../model/user')
const Product = require('../model/product')
const auth = require('../middelware/auth')
const router = express.Router()
const bcryptJs = require('bcryptjs')
const nodemailer = require('nodemailer')
const uniqid = require('uniqid');
//create user
router.post('/singUp', async (req, res) => {
    try {
        const user = new User(req.body)
        if (!user) return res.send('please enter the valid user')
        const token = user.gToken()
        await user.save()
        res.send({ user, token })
    } catch (e) {
        res.send(e.message)
    }
})
// login
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({ email })
        if (!user) return res.send('email or password is wrong')
        const isPass = await bcryptJs.compare(password, user.password)
        if (!isPass) return res.send('email or password is wrong')
        const token = user.gToken()
        res.send({ user, token })
    } catch (e) {
        res.send(e.message)
    }
})
// profile
router.get('/profile', auth.user, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.send(e.message)
    }
})
//update profile
router.patch('/profile/update', auth.user, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        updates.forEach(ele => req.user[ele] = req.body[ele])
        if (!updates) return res.send('please enter values')
        await req.user.save()
        res.send(req.user)
    }
    catch (e) {
        res.send(e.message)
    }
})
// delete acount
router.delete('/profile', auth.user, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.user._id })
        if (!user) return res.send('no user founded')
        res.send(user)
    } catch (e) {
        res.send(e.message)
    }
})
// forgot password
router.post('/forgotPassword', async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        const token = uniqid()
        user.passwordResetToken = token
        if (user) {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_ID, // generated ethereal user
                    pass: process.env.MP
                    , // generated ethereal password
                },
            });

            // send mail with defined transport object

            let info = await transporter.sendMail({
                from: '"shopping 👻" <abc@gmail.com.com>', // sender address
                to: user.email, // list of receivers
                subject: "forgot password", // Subject line
                text: ``, // plain text body
                html: `Hii ${user.name} <br>
                coby this code {  ${token}  } and pasted in code field`, // html body
            });
        }
        else {
            res.send('no user founded')
        }
        await user.save()
        res.send(user)


    } catch (e) {
        res.send(e.message)
    }
})
//reset password
router.patch('/resetPassword', async (req, res) => {
    try {
        const passwordResetToken = req.body.code
        const user = await User.findOne(passwordResetToken)
        if (!user) return res.send('you not user')
        user.password = req.body.password
        user.passwordResetToken = ""
        const token = user.gToken()
        await user.save()
        res.send({ user, token })
    }
    catch (e) {
        res.send(e.message)
    }

})

module.exports = router