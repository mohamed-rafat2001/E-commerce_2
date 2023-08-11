const express = require('express')
const router = express.Router()
const Product = require('../model/product')
const ProductCat = require('../model/productCat')
const auth = require('../middelware/auth')
// add new product category
router.post('/productCat', auth.user, auth.admin, async (req, res) => {
    try {
        const title = await ProductCat.findOne({ title: req.body.title })
        if (title) return res.send('category already exist')
        const cat = new ProductCat(req.body)
        await cat.save()
        res.send(cat)
    } catch (e) {
        res.send(e.message)
    }
})
// get product category
router.get('/productCat/:cat', async (req, res) => {
    try {
        const category = req.params.cat
        const products = await Product.find({ category })
        if (!products) return res.send('no product')
        res.send({ products, len: products.length })
    } catch (e) {
        res.send(e.message)
    }
})
// get all categories
router.get('/productCats/', async (req, res) => {
    try {

        const cats = await ProductCat.find({})
        if (!cats) return res.send('no product')
        res.send(cats)
    } catch (e) {
        res.send(e.message)
    }
})
// delete all categories
router.delete('/productCats/', auth.user, auth.admin, async (req, res) => {
    try {

        const cats = await ProductCat.deleteMany()
        if (!cats) return res.send('no product')
        res.send(cats)
    } catch (e) {
        res.send(e.message)
    }
})
// delete one productCat
router.delete('/productCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cats = await ProductCat.findByIdAndDelete(_id)
        if (!cats) return res.send('no product')
        res.send(cats)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router