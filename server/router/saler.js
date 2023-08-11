const express = require('express')
const User = require('../model/user')
const Product = require('../model/product')
const auth = require('../middelware/auth')
const multer = require('multer')
const router = express.Router()
// upload func
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpj|png|jfif|jpeg)$/)) {
            return cb(new Error('please upload the pic'), null)
        }
        cb(null, true)
    }
})
// add product by saler

router.post('/saler/product', auth.user, auth.saler, upload.array('pic', 6), async (req, res) => {
    try {
        const product = new Product({ ...req.body, saler: req.user._id })
        for (let i = 0; i < req.files.length; i++) { product.image[i] = req.files[i].buffer }
        await product.save()
        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
})
//update product
router.patch('/saler/product/:id', auth.user, auth.saler, async (req, res) => {
    try {
        const _id = req.params.id // product id
        const saler = req.user._id // saler id
        const product = await Product.findOneAndUpdate({ _id, saler }, req.body, { new: true, runValidators: true })
        if (!product) return res.send('please enter valid data')
        res.send(product)

    } catch (e) {
        res.send(e.message)
    }
})
//get all product by saler
router.get('/saler/products', auth.user, auth.saler, async (req, res) => {
    try {
        const _id = req.params.id // product id
        const saler = req.user._id // saler id
        const products = await Product.find({ saler })
        if (!products) return res.send('please enter valid data')
        res.send(products)

    } catch (e) {
        res.send(e.message)
    }
})
//delete all product by saler
router.delete('/saler/products', auth.user, auth.saler, async (req, res) => {
    try {
        const saler = req.user._id // saler id
        const products = await Product.find({ saler }).deleteMany()
        if (!products) return res.send('no product founded')
        res.send(products)

    } catch (e) {
        res.send(e.message)
    }
})
//delete product by saler
router.delete('/saler/product/:id', auth.user, auth.saler, async (req, res) => {
    try {
        const _id = req.params.id // product id
        const saler = req.user._id // saler id
        const products = await Product.findOneAndDelete({ _id, saler })
        if (!products) return res.send('no product founded')
        res.send(products)

    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router