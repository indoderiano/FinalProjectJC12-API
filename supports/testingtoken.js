console.log('testing token')



const jwt = require ('jsonwebtoken');
const data = {id:3}
const data2 = {id:20,username:'test'}
const token = jwt.sign(data, "puripuriprisoner", { expiresIn : '12h' })
const token2 = jwt.sign(data2, "shifu", { expiresIn : '5000' })

console.log(token2)

var tokenid='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI4MDkwNTEsImV4cCI6MTU5Mjg5NTQ1MX0.7bSQ9aqNXO3dGzVWorn0zmrOGZ3InBwG_VEEm4u_m7Y'


setTimeout(()=>{
    
    jwt.verify(tokenid, "puripuriprisoner", (error, decoded) => {
        if (error) {
            console.log('verify fail')
            // return res.status(401).json({ message: "User not authorized.", error: "User not authorized." });
        }else{
            console.log(decoded)
        }
            // next();
    });

},4000)
