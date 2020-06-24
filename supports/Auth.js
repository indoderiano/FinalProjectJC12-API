const jwt = require ('jsonwebtoken');

module.exports = {
    Auth : (req, res, next) => {
        // console.log(req.method)
        console.log(req.token)

        jwt.verify(req.token, "puripuriprisoner", (error, decoded) => {
            if (error){
                return res.status(401).json({ message: "User not authorized.", error: "User not authorized." });
            }
            
            req.user = decoded;
            next();
        })
    }
}