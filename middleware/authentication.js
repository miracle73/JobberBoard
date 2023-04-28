const jwt = require('jsonwebtoken')
const CustomApi = require('../errors/custom-api')
const { StatusCodes } = require('http-status-codes')
const authenticationMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new CustomApi('Authentication Invalid', StatusCodes.UNAUTHORIZED)
    }
    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, name } = decoded
        req.user = { id, name }
        next()
    }
    catch (error) {
        throw new CustomApi('Authentication did not work', StatusCodes.UNAUTHORIZED)
    }
}
module.exports = authenticationMiddleware