const { driver } = require('../config/neo4j');

// GET semua karier beserta skill yang dibutuhkan dan kursus terkait
const getAllCareers = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
        `MATCH (ca:Career)
        OPTIONAL MATCH (s:Skill)-[:REQUIRED_FOR]->(ca)
        OPTIONAL MATCH (c:Course)-[:BUILDS_SKILL]->(s)
        RETURN ca, collect(DISTINCT s) AS requiredSkills, collect(DISTINCT c) AS relevantCourses`
        );
        const careers = result.records.map(r => {
        const career = r.get('ca').properties;
        return {
            ...career,
            requiredSkills: r.get('requiredSkills').map(s => s.properties),
            relevantCourses: r.get('relevantCourses').map(c => c.properties)
        };
        });
        res.json({ success: true, data: careers, count: careers.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET satu karier lengkap dengan jalur pembelajaran penuh
const getCareerWithFullPath = async (req, res, next) => {
    const session = driver.session();
    try {
        const { position } = req.params;
        const result = await session.run(
        `MATCH (ca:Career)
        WHERE toLower(ca.position) CONTAINS toLower($position)
        OPTIONAL MATCH (s:Skill)-[:REQUIRED_FOR]->(ca)
        OPTIONAL MATCH (c:Course)-[:BUILDS_SKILL]->(s)
        OPTIONAL MATCH (a:Alumni)-[:WORKS_AS]->(ca)
        OPTIONAL MATCH (a)-[:WORKS_AT]->(co:Company)
        RETURN ca, 
                collect(DISTINCT s) AS skills, 
                collect(DISTINCT c) AS courses,
                collect(DISTINCT a) AS alumni,
                collect(DISTINCT co) AS companies`,
        { position }
        );
        if (result.records.length === 0) {
        return res.status(404).json({ success: false, message: 'Karier tidak ditemukan' });
        }
        const record = result.records[0];
        res.json({
        success: true,
        data: {
            career: record.get('ca').properties,
            requiredSkills: record.get('skills').map(s => s.properties),
            relevantCourses: record.get('courses').map(c => c.properties),
            alumniInPosition: record.get('alumni').map(a => ({
            name: a.properties.name,
            graduationYear: a.properties.graduation_year.toInt(),
            company: record.get('companies').find(co => co)?.properties.name
            }))
        }
        });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// POST tambah karier baru
const createCareer = async (req, res, next) => {
    const session = driver.session();
    try {
        const { position, industry } = req.body;
        const result = await session.run(
        `CREATE (ca:Career {position: $position, industry: $industry})
        RETURN ca`,
        { position, industry }
        );
        const career = result.records[0].get('ca').properties;
        res.status(201).json({ success: true, data: career });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getAllCareers, getCareerWithFullPath, createCareer };