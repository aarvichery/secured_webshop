const db = require('../config/db');

module.exports = {

    // ----------------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------------
    login: (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message, query: query });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            res.redirect('/');
        });
    },

    // ----------------------------------------------------------
    // POST /api/auth/register
    // ----------------------------------------------------------
    register: (_req, res) => {
    }
};
