const mongoose = require('mongoose'); // Erase if already required
const bcryptJs = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        index: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error('please enter valid password')
            }
        },
        trim: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    address: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'saler', 'admin']
    },
    passwordResetToken: { String },
    block: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
userSchema.methods.gToken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWTPASS)
    return token
}
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcryptJs.hash(this.password, 8)
    }
})
userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    return user
}
//Export the model
module.exports = mongoose.model('User', userSchema);