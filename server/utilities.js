const jwt = require('jsonwebtoken');

function authenticate(req, res, next) { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1] ;
    if (!token) return res.status(401).json({ message: 'Token is required' });
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(token)
            if(err) return res.sendStatus(401) ;
            req.user = user ;
            next();
     }) ;
}

module.exports = {authenticate};