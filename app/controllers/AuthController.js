const db = require('../config/db');
const bcrypt = require('bcryptjs');


module.exports = {

    // ----------------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------------
    login: (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis'});
        }

        const query = `SELECT * FROM users WHERE email = ?`;

        db.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message, query: query });
            }

            const user = results[0]; // On récupère l'utilisateur trouvé

        // 3. ON PRÉPARE LE POIVRE (comme au register)
        const pepper = process.env.PASSWORD_PEPPER;
        const passwordWithPepper = password + pepper;

        // 4. ON COMPARE (Le moment magique)
        // Bcrypt va extraire le sel tout seul du user.password (le hash en base)
        const isMatch = await bcrypt.compare(passwordWithPepper, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            res.redirect('/');
        });
    },

    // ----------------------------------------------------------
    // POST /api/auth/register
    // ----------------------------------------------------------
    register: (req, res) => {
        const { email, password, confirmPassword, username, address, nb_street, zip, city } = req.body;
        const fulladdress = `${nb_street} ${address}, ${zip} ${city}`

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const query = `SELECT * FROM users WHERE email = ? OR username = ?`;

        db.query(query, [email, username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message, query: query });
            }

            if (results.length > 0) {
                return res.status(401).json({ error: `Email ou nom d'utilisateur déjà utilisé` });
            }

            if(password == confirmPassword)
            {
                const pepper = process.env.PASSWORD_PEPPER;
                const salt = await bcrypt.genSalt(10);
                const passwordwithpepper = password + pepper
                const hashedPassword = await bcrypt.hash(passwordwithpepper, salt);

                if (results.length === 0) {
                    const search = `INSERT INTO users (username, email, password, role, address, photo_path) VALUES (?, ?, ?, ?, ?, ?)`;
                    db.query(search, [username, email, hashedPassword, 'user', `${nb_street} ${address}, ${zip} ${city}`, null ] ,(err, result) => {
                        if (err) {
                            console.error("Erreur d'inscription :", err.message);
                            return res.status(500).send("Erreur lors de la création du compte.");
                        }

                        res.redirect('/');
                    })
                }
            }
            else
            {
                console.log('not ok')
            }
        });
    }
};
