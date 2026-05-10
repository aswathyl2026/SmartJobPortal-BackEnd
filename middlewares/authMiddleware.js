const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    console.log("Inside Authentication Method");
    const token = req.headers['authorization'].split(" ")[1]
    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.JWTSECRET)
            req.user = jwtResponse
            next()
        }
        catch (err) {
            res.status(400).json("Invalid Token")
        }
    } else {
        res.status(400).json("Authorization failed")
    }

}
module.exports = authMiddleware