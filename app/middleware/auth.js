// =============================================================
// Middleware d'authentification
// =============================================================

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.redirect("/login?error=not_connected");
    }

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verifiedToken;

        next();
    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/login?error=invalid_session");
    }
};