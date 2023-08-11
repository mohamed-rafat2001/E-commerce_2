const mongoose = require('mongoose')
const dbConnect = () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/ECommerce')
        console.log('db connect')
    }
    catch (e) {
        console.log(e.message)
    }
}
module.exports = dbConnect