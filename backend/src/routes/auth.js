const express = require('express');
const router = express.Router();
const { driver } = require('../config/neo4j');

router.post('/sso', async (req, res, next) => {
    const { sso_id } = req.body;
    const session = driver.session();
    try {
        const name = "Mahasiswa UI";

        await session.run(
            `MERGE (u:User {sso_id: $sso_id})
            ON CREATE SET u.name = $name, u.role = 'Alumni'`,
            { sso_id, name }
        );

        res.json({ success: true, sso_id, name, token: "dummy_jwt_token" });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
});

module.exports = router;