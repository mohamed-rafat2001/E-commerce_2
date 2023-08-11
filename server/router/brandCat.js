const express = require('express')
const router = express.Router()
const Product = require('../model/product')
const BrandCat = require('../model/brandCat')
const auth = require('../middelware/auth')
// add new product category
router.post('/brandCat', auth.user, auth.admin, async (req, res) => {
    try {
        const title = await BrandCat.findOne({ title: req.body.title })
        if (title) return res.send('category already exist')
        const cat = new BrandCat(req.body)
        await cat.save()
        res.send(cat)
    } catch (e) {
        res.send(e.message)
    }
})
// get product category
router.get('/brandCat/:brand', async (req, res) => {
    try {
        const brand = req.params.brand
        const products = await Product.find({ brand })
        if (!products) return res.send('no product')
        res.send({ products, len: products.length })
    } catch (e) {
        res.send(e.message)
    }
})
// get all categories
router.get('/brandCats/', async (req, res) => {
    try {

        const cats = await BrandCat.find({})
        if (!cats) return res.send('no product')
        res.send(cats)
    } catch (e) {
        res.send(e.message)
    }
})
// delete all categories
router.delete('/brandCats/', auth.user, auth.admin, async (req, res) => {
    try {

        const cats = await BrandCat.deleteMany()
        if (!cats) return res.send('no product')
        res.send(cats)
    } catch (e) {
        res.send(e.message)
    }
})
// delete one productCat
router.delete('/brandCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cats = await BrandCat.findByIdAndDelete(_id)
        if (!cats) return res.send('no product')
        res.send(cats)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router