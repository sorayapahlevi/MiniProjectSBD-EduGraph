const { driver } = require('../config/neo4j');

// GET semua skill beserta kursus yang membangun skill tersebut
const getAllSkills = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (s:Skill)
            OPTIONAL MATCH (c:Course)-[:BUILDS_SKILL]->(s)
            OPTIONAL MATCH (s)-[:REQUIRED_FOR]->(ca:Career)
            RETURN s, collect(DISTINCT c) AS courses, collect(DISTINCT ca) AS careers
            ORDER BY s.category, s.name`
        );
        const skills = result.records.map(r => {
            const skill = r.get('s').properties;
            return {
                ...skill,
                courses: r.get('courses').map(c => c.properties),
                careers: r.get('careers').map(ca => ca.properties)
            };
        });
        res.json({ success: true, data: skills, count: skills.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET skill yang paling banyak dibutuhkan di dunia karier
const getMostValuableSkills = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (s:Skill)-[:REQUIRED_FOR]->(ca:Career)
            WITH s, count(DISTINCT ca) AS careerCount
            OPTIONAL MATCH (c:Course)-[:BUILDS_SKILL]->(s)
            RETURN s, careerCount, collect(c.name) AS courses
            ORDER BY careerCount DESC
            LIMIT 5`
        );
        const skills = result.records.map(r => ({
            skill: r.get('s').properties,
            careerCount: r.get('careerCount').toInt(),
            supportingCourses: r.get('courses')
        }));
        res.json({ success: true, data: skills });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// POST tambah skill baru
const createSkill = async (req, res, next) => {
    const session = driver.session();
    try {
        const { name, category } = req.body;
        const result = await session.run(
            `CREATE (s:Skill {name: $name, category: $category})
            RETURN s`,
            { name, category }
        );
        const skill = result.records[0].get('s').properties;
        res.status(201).json({ success: true, data: skill });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getAllSkills, getMostValuableSkills, createSkill };