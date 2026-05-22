const { driver } = require('../config/neo4j');

const getMostConnected = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (n)
            WHERE n.name IS NOT NULL
            RETURN labels(n)[0] AS type,
            n.name AS name,
            COUNT { (n)--() } AS degree
            ORDER BY degree DESC
            LIMIT 10`
        );
        const data = result.records.map(r => ({
            type: r.get('type'),
            name: r.get('name'),
            degree: r.get('degree').toInt()
        }));
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

const getPopularCareers = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (a:Alumni)-[:WORKS_AS]->(k:Career)
            RETURN k.position AS career,
                k.industry AS industry,
            COUNT(a) AS alumni_count
            ORDER BY alumni_count DESC
            LIMIT 8`
        );
        const data = result.records.map(r => ({
            career: r.get('career'),
            industry: r.get('industry'),
            count: r.get('alumni_count').toInt()
        }));
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getMostConnected, getPopularCareers };