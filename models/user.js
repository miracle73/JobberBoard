const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],

    },
    location: {
        type: String,
        required: [true, 'Please provide your location'],
        trim: true,
        minlength: 3,
        maxlength: 20
    },
})
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt)
    next()
})
UserSchema.methods.createJWT = async function () {
    const token = await jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return token
}
UserSchema.methods.comparePasswords = async function (candidatePassword) {
    const match = await bcrypt.compare(candidatePassword, this.password)
    return match

}
module.exports = mongoose.model('User', UserSchema)