const db = require('../config/db');


module.exports = {

    // ----------------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------------
    login: (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis'});
        }

        const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

        db.query(query, [email, password], (err, results) => {
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
    register: (req, res) => {
        const { email, password, username, address, nb_street, zip, city } = req.body;
        const fulladdress = `${nb_street} ${address}, ${zip} ${city}`

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const query = `SELECT * FROM users WHERE email = ? OR username = ?`;

        db.query(query, [email, username], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message, query: query });
            }

            if (results.length > 0) {
                return res.status(401).json({ error: `Email ou nom d'utilisateur déjà utilisé` });
            }

            if (results.length === 0) {
                const search = `INSERT INTO users (username, email, password, role, address, photo_path) VALUES (?, ?, ?, ?, ?, ?)`;
                db.query(search, [username, email, password, 'user', address, null ] ,(err, result) => {
                    if (err) {
                        console.error("Erreur d'inscription :", err.message);
                        return res.status(500).send("Erreur lors de la création du compte.");
                    }

                    res.redirect('/');
                })
            }
        });
    }
};
