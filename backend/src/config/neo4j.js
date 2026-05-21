const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const verifyConnectivity = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('Koneksi Neo4j berhasil');
    } catch (err) {
        console.error('Koneksi Neo4j gagal:', err.message);
        process.exit(1);
    }
};

module.exports = { driver, verifyConnectivity };