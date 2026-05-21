const { driver } = require('../config/neo4j');

// Jalur lengkap: Course → Skill → Career untuk posisi tertentu
const getCareerPath = async (req, res, next) => {
    const session = driver.session();
    try {
        const { position } = req.params;
        const result = await session.run(
        `MATCH (c:Course)-[:BUILDS_SKILL]->(s:Skill)-[:REQUIRED_FOR]->(ca:Career)
        WHERE toLower(ca.position) CONTAINS toLower($position)
        RETURN c.code AS courseCode, c.name AS courseName,
                s.name AS skillName, ca.position AS careerPosition
        ORDER BY c.semester`,
        { position }
        );
        const data = result.records.map(r => ({
        courseCode: r.get('courseCode'),
        courseName: r.get('courseName'),
        skillName: r.get('skillName'),
        careerPosition: r.get('careerPosition'),
        }));
        res.json({ success: true, data, count: data.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// Alumni yang bekerja di posisi karier tertentu beserta mata kuliah yang mereka selesaikan
const getAlumniByCareer = async (req, res, next) => {
    const session = driver.session();
    try {
        const { position } = req.params;
        const result = await session.run(
        `MATCH (a:Alumni)-[:WORKS_AS]->(ca:Career)
        WHERE toLower(ca.position) CONTAINS toLower($position)
        OPTIONAL MATCH (a)-[:WORKS_AT]->(co:Company)
        OPTIONAL MATCH (a)-[:COMPLETED]->(c:Course)
        RETURN a.name AS alumniName, a.graduation_year AS graduationYear,
                co.name AS company, collect(c.name) AS completedCourses, ca.position AS position`,
        { position }
        );
        const data = result.records.map(r => ({
        alumniName: r.get('alumniName'),
        graduationYear: r.get('graduationYear').toInt(),
        company: r.get('company'),
        position: r.get('position'),
        completedCourses: r.get('completedCourses'),
        }));
        res.json({ success: true, data, count: data.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// Rekomendasi dosen mentor berdasarkan target karier
const getMentorRecommendation = async (req, res, next) => {
    const session = driver.session();
    try {
        const { position } = req.params;
        const result = await session.run(
        `MATCH (s:Skill)-[:REQUIRED_FOR]->(ca:Career)
        WHERE toLower(ca.position) CONTAINS toLower($position)
        MATCH (f:Faculty)-[:RESEARCHES]->(s)
        OPTIONAL MATCH (f)-[:TEACHES]->(c:Course)
        RETURN f.name AS facultyName, f.research_interest AS researchInterest,
                s.name AS relevantSkill, collect(c.name) AS coursesTaught`,
        { position }
        );
        const data = result.records.map(r => ({
        facultyName: r.get('facultyName'),
        researchInterest: r.get('researchInterest'),
        relevantSkill: r.get('relevantSkill'),
        coursesTaught: r.get('coursesTaught'),
        }));
        res.json({ success: true, data, count: data.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// Gambaran statistik keseluruhan graph
const getGraphStats = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(`
        MATCH (c:Course) WITH count(c) AS courses
        MATCH (s:Skill) WITH courses, count(s) AS skills
        MATCH (ca:Career) WITH courses, skills, count(ca) AS careers
        MATCH (a:Alumni) WITH courses, skills, careers, count(a) AS alumni
        MATCH (f:Faculty) WITH courses, skills, careers, alumni, count(f) AS faculty
        MATCH ()-[r]->() WITH courses, skills, careers, alumni, faculty, count(r) AS relationships
        RETURN courses, skills, careers, alumni, faculty, relationships
        `);
        const record = result.records[0];
        const stats = {
        nodes: {
            courses: record.get('courses').toInt(),
            skills: record.get('skills').toInt(),
            careers: record.get('careers').toInt(),
            alumni: record.get('alumni').toInt(),
            faculty: record.get('faculty').toInt(),
        },
        totalRelationships: record.get('relationships').toInt(),
        };
        res.json({ success: true, data: stats });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getCareerPath, getAlumniByCareer, getMentorRecommendation, getGraphStats };