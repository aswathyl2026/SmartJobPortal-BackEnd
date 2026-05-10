const roleMiddleware = (...roles) => {

    return (req, res, next) => {
        console.log("inside role authorization");
        if (!roles.includes(req.user.role)) {
           return res.status(403).json("Access Denied")
        }
        next()
    }
}
module.exports=roleMiddleware
