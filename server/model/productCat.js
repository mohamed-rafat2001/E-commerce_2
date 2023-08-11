const mongoose = require('mongoose')
const productCatSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },

}, { timestamps: true })
module.exports = mongoose.model('productCat', productCatSchema)