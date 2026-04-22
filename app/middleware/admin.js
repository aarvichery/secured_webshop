// =============================================================
// Middleware d'admin (CORRIGÉ)
// =============================================================

module.exports = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login?error=not_connected");
    }

    if (req.user.role !== 'admin') {
        return res.redirect("/?error=forbidden");
    }
    
    next();
};