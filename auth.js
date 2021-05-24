const jwt = require('jsonwebtoken')
exports.authenticateUser = async(req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decode = await jwt.verify(token, 'token')
    next()
    console.log(decode)
}