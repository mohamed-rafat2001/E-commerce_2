const express = require('express')
const router = express.Router()
const User = require('../model/user')
const Product = require('../model/product')
const Cart = require('../model/cart')
const auth = require('../middelware/auth')
const Order = require('../model/order')
router.post('/order', auth.user, async (req, res) => {
    try {
        const user = await Cart.findById(req.user.cart)
        const product = user.products.map(el => el.product)
        const pro = await Product.find({ _id: product })
        const salerOrder = await Order.find()

        res.send(pro)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router