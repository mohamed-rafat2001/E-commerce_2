const express = require('express')
const router = express.Router()
const User = require('../model/user')
const Product = require('../model/product')
const Cart = require('../model/cart')
const auth = require('../middelware/auth')
const cart = require('../model/cart')
// create new cart
router.post('/cart', auth.user, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (user.cart) {
            await Cart.findById(user.cart).deleteOne()

        }
        const cart = new Cart({ ...req.body, ordredBy: req.user._id })
        user.cart = cart._id
        const price = []
        const countPro = []
        for (let i = 0; i < cart.products.length; i++) {
            countPro.push(Number(cart.products[i].count))
            const product = await Product.findById(cart.products[i].product)
            price.push(Number(product.price) * Number(cart.products[i].count))
        }
        cart.totalProducts = countPro.reduce((a, b) => a + b, 0)
        cart.totalPrice = price.reduce((a, b) => a + b, 0)
        await cart.save()
        await user.save()
        res.send(cart)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get user cart
router.get('/cart', auth.user, async (req, res) => {
    try {
        const cart = await Cart.findById(req.user.cart).populate('products.product')
        res.send(cart)
    } catch (e) {
        res.send(e.message)
    }
})
// delete usercart by user
router.delete('/cart', auth.user, async (req, res) => {
    try {
        if (!req.user.cart) return res.send('no cart founded')
        const cart = await Cart.findByIdAndDelete(req.user.cart)
        await User.findByIdAndUpdate(req.user._id, { $unset: { cart: '' } }, { new: true })
        res.send(cart)
    } catch (e) {
        res.send(e.message)
    }
})
//delete product from cart
router.delete('/cart/deletePro/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id
        const cartId = req.user.cart
        const cart = await Cart.findById(cartId)
        const product = cart.products.find(el => el.product.toString() == _id) // product in cart
        if (!product) return res.send('no product founded')
        const pro = await Product.findById(product.product) //product in model
        const dltPro = await Cart.findByIdAndUpdate(cartId, {
            $pull: { products: product },
            $set: {
                totalPrice: cart.totalPrice - product.count * pro.price,
                totalProducts: cart.totalProducts - product.count
            }
        }, { new: true })
        res.send(dltPro)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router