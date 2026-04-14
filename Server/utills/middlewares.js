const { verifyAccessToken } = require("./jwtTools.js");

function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = decoded;
    next();
}

function authenticateSocket(socket, next) {
    const token = socket.handshake.auth.token;

    if(!token) {
        next(new Error('Authentication required'));
    }

    try {
        const decoded = verifyAccessToken(token);
        socket.user = decoded;
        
        next();
    } catch(e) {
        next(new Error("Invalid Token Or expired"));
    }
}

module.exports = {
    authenticateUser,
    authenticateSocket
}