const db = require('../config/db');
const jwt = require('jsonwebtoken');
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

            const user = results[0];

        const pepper = process.env.PASSWORD_PEPPER;
        const passwordWithPepper = password + pepper;

        const isMatch = await bcrypt.compare(passwordWithPepper, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const token = jwt.sign({
                id: user.id,
                user: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: '10s'});

            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: true,
            })

            const refreshToken = jwt.sign({
                id: user.id,
                user: user.username,
                role: user.role
            }, process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '24h' });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            })

            console.log(user.id);
            console.log(user.username);
            console.log(user.role);
            res.redirect('/');
        });
    },

    refresh: (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    // Si pas de token de rechange
    if (!refreshToken) return res.status(401).send('Accès refusé');
    // Si invalide
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token invalide');

        // Générer un nouvel Access Token
        const newAccessToken = jwt.sign({ id: user.id, user: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // accessToken = newAccessToken
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
        res.json({ message: "Token rafraîchi" });
    });
},

    // ----------------------------------------------------------
    // POST /api/auth/register
    // ----------------------------------------------------------
    register: (req, res) => {
        const { email, password, confirmPassword, username, address, nb_street, zip, city } = req.body;
        const fulladdress = `${nb_street} ${address}, ${zip} ${city}`
        const emailLower = email.toLowerCase();
        let score = 0;

        if(password.length >= 8) score += 20;
        else{return res.status(400).json({ error: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial, et au minimum 8 caractères'})}

        if(/[A-Z]/.test(password)) score += 20;
        else{return res.status(400).json({ error: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial, et au minimum 8 caractères'})}

        if(/[a-z]/.test(password)) score += 20;
        else{return res.status(400).json({ error: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial, et au minimum 8 caractères'})}

        if(/\d/.test(password)) score += 20;
        else{return res.status(400).json({ error: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial, et au minimum 8 caractères'})}

        if(/[@$!%*?&-]/.test(password)) score += 20;
        else{return res.status(400).json({ error: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial, et au minimum 8 caractères'})}

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ error: "Vos mots de passes ne sont pas les mêmes" });
        }

        const query = `SELECT * FROM users WHERE email = ? OR username = ?`;

        db.query(query, [emailLower, username], async (err, results) => {
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
                    db.query(search, [username, emailLower, hashedPassword, 'user', `${nb_street} ${address}, ${zip} ${city}`, null ] ,(err, result) => {
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
