const { driver } = require('../config/neo4j');

// GET semua alumni beserta karier dan perusahaan
const getAllAlumni = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
        `MATCH (a:Alumni)
        OPTIONAL MATCH (a)-[:WORKS_AS]->(ca:Career)
        OPTIONAL MATCH (a)-[:WORKS_AT]->(co:Company)
        OPTIONAL MATCH (a)-[:COMPLETED]->(c:Course)
        RETURN a, collect(DISTINCT ca) AS careers, collect(DISTINCT co) AS companies, collect(DISTINCT c) AS courses
        ORDER BY a.graduation_year DESC`
        );
        const alumni = result.records.map(r => {
        const alumnus = r.get('a').properties;
        return {
            ...alumnus,
            careers: r.get('careers').map(ca => ca.properties),
            companies: r.get('companies').map(co => co.properties),
            courses: r.get('courses').map(c => c.properties)
        };
        });
        res.json({ success: true, data: alumni, count: alumni.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET satu alumni berdasarkan nama
const getAlumniByName = async (req, res, next) => {
    const session = driver.session();
    try {
        const { name } = req.params;
        const result = await session.run(
        `MATCH (a:Alumni {name: $name})
        OPTIONAL MATCH (a)-[:WORKS_AS]->(ca:Career)
        OPTIONAL MATCH (a)-[:WORKS_AT]->(co:Company)
        OPTIONAL MATCH (a)-[:COMPLETED]->(c:Course)-[:BUILDS_SKILL]->(s:Skill)
        RETURN a, 
                collect(DISTINCT ca) AS careers, 
                collect(DISTINCT co) AS companies, 
                collect(DISTINCT c) AS completedCourses,
                collect(DISTINCT s) AS acquiredSkills`,
        { name }
        );
        if (result.records.length === 0) {
        return res.status(404).json({ success: false, message: 'Alumni tidak ditemukan' });
        }
        const record = result.records[0];
        const alumnus = record.get('a').properties;
        res.json({
        success: true,
        data: {
            ...alumnus,
            careers: record.get('careers').map(ca => ca.properties),
            companies: record.get('companies').map(co => co.properties),
            completedCourses: record.get('completedCourses').map(c => c.properties),
            acquiredSkills: record.get('acquiredSkills').map(s => s.properties)
        }
        });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET jalur pembelajaran alumni: Course -> Skill untuk alumni tertentu
const getAlumniLearningPath = async (req, res, next) => {
    const session = driver.session();
    try {
        const { name } = req.params;
        const result = await session.run(
            `MATCH (a:Alumni {name: $name})-[:COMPLETED]->(c:Course)-[:BUILDS_SKILL]->(s:Skill)
            OPTIONAL MATCH (s)-[:REQUIRED_FOR]->(ca:Career)
            RETURN c.name AS courseName, s.name AS skillName, s.category AS skillCategory, collect(DISTINCT ca.position) AS relevantCareers`,
            { name }
        );
        const learningPath = result.records.map(r => ({
            courseName: r.get('courseName'),
            skillName: r.get('skillName'),
            skillCategory: r.get('skillCategory'),
            relevantCareers: r.get('relevantCareers')
        }));
        res.json({ success: true, data: learningPath, count: learningPath.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// POST tambah alumni baru
const createAlumni = async (req, res, next) => {
    const session = driver.session();
    try {
        const { name, graduation_year, company } = req.body;
        const result = await session.run(
            `CREATE (a:Alumni {name: $name, graduation_year: $graduation_year, company: $company})
            RETURN a`,
            { name, graduation_year, company }
        );
        const alumnus = result.records[0].get('a').properties;
        res.status(201).json({ success: true, data: alumnus });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getAllAlumni, getAlumniByName, getAlumniLearningPath, createAlumni };