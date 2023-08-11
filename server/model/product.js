const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    saler: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowercase: true
    },
    descrption: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    image: [{
        type: Buffer,
        required: true
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
    disLike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
    likeNum: { type: Number, default: 0 },
    disLikeNum: { type: Number, default: 0 },
    rating: { String },
    views: { type: Number, default: 0 }

}, { timestamps: true });
productSchema.methods.toJSON = function () {
    const pro = this.toObject()
    return pro
}
//Export the model
module.exports = mongoose.model('Product', productSchema);