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
    register: (req, res) => {
        const { email, password, username, address, nb_street, zip, city } = req.body;
        const fulladdress = `${nb_street} ${address}, ${zip} ${city}`

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const query = `SELECT * FROM users WHERE email = '${email}'`;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message, query: query });
            }

            if (results.length > 0) {
                return res.status(401).json({ error: 'Email déjà utilisé' });
            }

            if (results.length === 0) {
                const search = `INSERT INTO users (username, email, password, role, address, photo_path) VALUES ('${username}', '${email}', '${password}', 'user', '${fulladdress}', NULL)`;
                db.query(search, (err, result) => {
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
