const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    orders: [{
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            count: Number,
            color: String
        }],
        orderStatus: {
            type: String,
            default: 'Not processing',
            enum: ['Not processing', 'Cash On Delivery', 'Processing', 'Dispatshed', 'Cancelled', 'Delivered']
        },
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
    saler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

//Export the model
module.exports = mongoose.model('Order', orderSchema);