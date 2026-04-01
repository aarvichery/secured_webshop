const path = require('path');
const db = require('../config/db');

module.exports = {

    // ----------------------------------------------------------
    // GET /api/profile
    // ----------------------------------------------------------
    get: (req, res) => {
        const userId = req.user.id;
        console.log(req.user)
        db.query('SELECT id, username, email, role, address, photo_path FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Utilisateur introuvable' });
            }
            res.json(results[0]);
        });
    },

    // ----------------------------------------------------------
    // POST /api/profile
    // ----------------------------------------------------------
    update: (req, res) => {
        const userId = DEFAULT_USER_ID;
        const { address } = req.body;

        db.query('UPDATE users SET address = ? WHERE id = ?', [address, userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.json({ message: 'Profil mis à jour' });
        });
    },

    // ----------------------------------------------------------
    // POST /api/profile/photo
    // ----------------------------------------------------------
    uploadPhoto: (req, res) => {
        const userId = DEFAULT_USER_ID; // TODO exercice 5 : remplacer par req.user.id

        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier reçu' });
        }

        const photoPath = '/uploads/' + req.file.filename;

        db.query('UPDATE users SET photo_path = ? WHERE id = ?', [photoPath, userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.json({ message: 'Photo mise à jour', photo_path: photoPath });
        });
    }
};
