const User = require('../models/user')
const CustomApi = require('../errors/custom-api')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
    const data = req.body
    const user = await User.create(data)
    const token = await user.createJWT()
    const { firstName, lastName, email, location } = data
    res.status(StatusCodes.CREATED).json({ user: { firstName, lastName, email, location }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomApi('Invalid Email or Password', StatusCodes.BAD_REQUEST)
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomApi('Invalid Credentials', StatusCodes.UNAUTHORIZED)
    }
    const match = await user.comparePasswords(password)
    if (match) {
        const token = await user.createJWT()
        res.status(StatusCodes.CREATED).json({ message: 'Successfully signed in', token })
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Try again' })
    }

}

const updateUser = async (req, res) => {
    const { email, firstName, lastName, location } = req.body
    // if (company == " " || position == " ") {
    //     throw new CustomApi('Please the company or position field cannot be empty', StatusCodes.BAD_REQUEST)
    // }
    const user = await User.findOneAndUpdate({ _id: req.user.id }, { email, firstName, lastName, location }, { runValidators: true, timestamps: false })
    if (!user) {
        throw new CustomApi('No such user exists', StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ msg: 'Successfully updated' })
}


module.exports = {
    register, login, updateUser
}