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
            `MATCH (ca:Career) WHERE toLower(ca.position) CONTAINS toLower($position)
            MATCH (s:Skill)-[:REQUIRED_FOR]->(ca)
            MATCH (f:Faculty)-[:RESEARCHES]->(s)
            RETURN f.name AS facultyName, f.research_interest AS researchInterest, s.name AS relevantSkill`,
            { position }
        );
        const mentors = result.records.map(r => ({
            facultyName: r.get('facultyName'),
            researchInterest: r.get('researchInterest'),
            relevantSkill: r.get('relevantSkill')
        }));
        res.json({ success: true, data: mentors });
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

const getEntireGraph = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run('MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m');
        const nodes = [];
        const links = [];
        result.records.forEach(record => {
            const n = record.get('n');
            const r = record.get('r');
            const m = record.get('m');
            if (n && !nodes.find(node => node.id === n.elementId)) {
                nodes.push({ id: n.elementId, label: n.labels[0], name: n.properties.name || n.properties.position || n.properties.code });
            }
            if (m && !nodes.find(node => node.id === m.elementId)) {
                nodes.push({ id: m.elementId, label: m.labels[0], name: m.properties.name || m.properties.position || m.properties.code });
            }
            if (r) {
                links.push({ source: n.elementId, target: m.elementId, type: r.type });
            }
        });
        res.json({ nodes, links });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// Topic neighborhood: find 1-2 hop neighbors from a matching Skill node
const getTopicNeighborhood = async (req, res, next) => {
    const session = driver.session();
    try {
        const { topic } = req.params;
        const result = await session.run(
            `MATCH (s:Skill)
             WHERE toLower(s.name) CONTAINS toLower($topic)
                OR toLower(s.category) CONTAINS toLower($topic)
             WITH s LIMIT 3

             // 1-hop: direct neighbors
             OPTIONAL MATCH (c:Course)-[:BUILDS_SKILL]->(s)
             OPTIONAL MATCH (f:Faculty)-[:RESEARCHES]->(s)
             OPTIONAL MATCH (s)-[:REQUIRED_FOR]->(ca:Career)

             // 2-hop: faculty who teach those courses
             OPTIONAL MATCH (f2:Faculty)-[:TEACHES]->(c)

             RETURN s,
                    collect(DISTINCT c)  AS courses,
                    collect(DISTINCT f)  AS researchFaculty,
                    collect(DISTINCT f2) AS teachingFaculty,
                    collect(DISTINCT ca) AS careers`,
            { topic }
        );

        if (result.records.length === 0) {
            return res.json({ success: true, data: null, message: 'Topik tidak ditemukan.' });
        }

        const toInt = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'object' && 'low' in val) return val.low;
    return val;
};

        const data = result.records.map(r => ({
            skill: r.get('s').properties,
            courses: r.get('courses').map(c => ({
                ...c.properties,
                semester: toInt(c.properties.semester),
                credits: toInt(c.properties.credits),
            })),
            mentors: [
                ...r.get('researchFaculty').map(f => ({
                    ...f.properties, connection: 'Meneliti skill ini'
                })),
                ...r.get('teachingFaculty').map(f => ({
                    ...f.properties, connection: 'Mengajar mata kuliah terkait'
                }))
            ].filter((m, i, arr) =>
                arr.findIndex(x => x.name === m.name) === i
            ),
            careers: r.get('careers').map(ca => ca.properties)
        }));

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = {
    getCareerPath, getAlumniByCareer, getMentorRecommendation,
    getGraphStats, getEntireGraph,
    getTopicNeighborhood  
};
