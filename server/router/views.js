const express = require('express')
const User = require('../model/user')
const Product = require('../model/product')
const auth = require('../middelware/auth')
const router = express.Router()
// get product 
router.get('/product/:id', async (req, res) => {
    try {
        const _id = req.params.id // product id
        const product = await Product.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true, runValidators: true })
        if (!product) return res.send('no product founded')
        res.send(product)

    } catch (e) {
        res.send(e.message)
    }
})
// all product
router.get('/products', async (req, res) => {
    try {
        const product = await Product.find({})
        if (!product) return res.send('no product founded')
        res.send(product)

    } catch (e) {
        res.send(e.message)
    }
})
// like for product
router.patch('/like/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // product id
        const product = await Product.findById(_id)
        const isLiked = product.like.find(el => el == req.user._id.toString())
        if (!isLiked) {

            const like = await Product.findByIdAndUpdate(_id,
                {
                    $push: { like: req.user._id },
                    $pull: { disLike: req.user._id }
                    , likeNum: product.like.length + 1,
                    disLikeNum: product.disLike.length > 0 ? product.disLike.length - 1 : product.disLike.length
                }
                , { new: true, runValidators: true })
            const user = await User.findByIdAndUpdate({ _id: req.user._id },
                { $push: { wishList: req.user._id } },
                { new: true, runValidators: true })

            return res.send(like)
        }
        else if (isLiked) {
            const like = await Product.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id, disLike: req.user._id },
                    likeNum: product.like.length - 1,
                    disLikeNum: product.disLike.length
                }
                , { new: true, runValidators: true })
            const user = await User.findByIdAndUpdate({ _id: req.user._id },
                { $pull: { wishList: req.user._id } },
                { new: true, runValidators: true })
            return res.send(like)
        }
        res.send(product.like.length)

    }
    catch (e) {
        res.send(e.message)
    }
})
// dislike for product
router.patch('/disLike/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // product id
        const product = await Product.findById(_id)
        const isDisLiked = product.disLike.find(el => el == req.user._id.toString())
        if (!isDisLiked) {
            const disLike = await Product.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id },
                    $push: { disLike: req.user._id }
                    , disLikeNum: product.disLike.length + 1,
                    likeNum: product.like.length > 0 ? product.like.length - 1 : product.like.length
                }
                , { new: true, runValidators: true })
            const user = await User.findByIdAndUpdate({ _id: req.user._id },
                { $pull: { wishList: req.user._id } },
                { new: true, runValidators: true })
            return res.send(disLike)
        }
        else if (isDisLiked) {
            const disLike = await Product.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id, disLike: req.user._id },
                    likeNum: product.like.length,
                    disLikeNum: product.disLike.length - 1
                }
                , { new: true, runValidators: true })
            const user = await User.findByIdAndUpdate({ _id: req.user._id },
                { $pull: { wishList: req.user._id } },
                { new: true, runValidators: true })
            return res.send(disLike)
        }
        res.send(product.disLike.length)

    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = router