const { driver } = require('../config/neo4j');

// GET semua mata kuliah
const getAllCourses = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run('MATCH (c:Course) RETURN c ORDER BY c.semester');
        const courses = result.records.map(r => r.get('c').properties);
        res.json({ success: true, data: courses, count: courses.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET satu mata kuliah beserta skill yang dibangun
const getCourseWithSkills = async (req, res, next) => {
    const session = driver.session();
    try {
        const { code } = req.params;
        const result = await session.run(
        `MATCH (c:Course {code: $code})
        OPTIONAL MATCH (c)-[:BUILDS_SKILL]->(s:Skill)
        RETURN c, collect(s) AS skills`,
        { code }
        );
        if (result.records.length === 0) {
        return res.status(404).json({ success: false, message: 'Mata kuliah tidak ditemukan' });
        }
        const record = result.records[0];
        res.json({
        success: true,
        data: {
            course: record.get('c').properties,
            skills: record.get('skills').map(s => s.properties),
        },
        });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET rantai prasyarat suatu mata kuliah
const getCoursePrerequisiteChain = async (req, res, next) => {
    const session = driver.session();
    try {
        const { code } = req.params;
        const result = await session.run(
        `MATCH path = (start:Course)-[:PREREQUISITE_OF*]->(target:Course {code: $code})
        RETURN [node IN nodes(path) | node.name] AS chain`,
        { code }
        );
        const chains = result.records.map(r => r.get('chain'));
        res.json({ success: true, data: chains });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getAllCourses, getCourseWithSkills, getCoursePrerequisiteChain };