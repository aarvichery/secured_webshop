// =============================================================
// Middleware d'authentification
// =============================================================

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        return res.redirect('/login');
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Si le token n'existe plus
            if (!refreshToken) return res.redirect('/login');

            // RefreshDecoded correspond à l'objet contenu dans le token, RefreshErr est les erreurs du token
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshDecoded) => {
                if (refreshErr) return res.redirect('/login');

                // Créer nouveau token
                const newAccessToken = jwt.sign(
                    { id: refreshDecoded.id, user: refreshDecoded.user, role: refreshDecoded.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '10s' }
                );

                // accessToken = newAccessToken
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
                
                req.user = refreshDecoded;
                return next();
            });
        } else {
            req.user = decoded;
            next();
        }
    });
};