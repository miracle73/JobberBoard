const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide the company name'],
        trim: true,
        maxlength: 50

    },
    position: {
        type: String,
        required: [true, 'Please provide your position in the company'],
        trim: true,
        maxlength: 50
    },
    jobType: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid', 'internship', 'part-time', 'full-time'],
        default: 'full-time'

    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide User'],
    },
    resume: {
        type: String,
        required: true
    }
},
    { timestamps: true })


module.exports = mongoose.model('Job', JobSchema)