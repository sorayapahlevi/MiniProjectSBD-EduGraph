const { driver } = require('../config/neo4j');

// GET semua dosen beserta keahlian riset dan mata kuliah yang diampu
const getAllFaculty = async (req, res, next) => {
    const session = driver.session();
    try {
        const result = await session.run(
        `MATCH (f:Faculty)
        OPTIONAL MATCH (f)-[:TEACHES]->(c:Course)
        OPTIONAL MATCH (f)-[:RESEARCHES]->(s:Skill)
        OPTIONAL MATCH (s)-[:REQUIRED_FOR]->(ca:Career)
        RETURN f, collect(DISTINCT c) AS courses, collect(DISTINCT s) AS skills, collect(DISTINCT ca) AS relatedCareers
        ORDER BY f.name`
        );
        const faculty = result.records.map(r => {
            const lecturer = r.get('f').properties;
            return {
                ...lecturer,
                coursesTaught: r.get('courses').map(c => c.properties),
                researchSkills: r.get('skills').map(s => s.properties),
                researchImpactOnCareers: r.get('relatedCareers').map(ca => ca.properties)
            };
        });
        res.json({ success: true, data: faculty, count: faculty.length });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

// GET satu dosen beserta mahasiswa/alumni yang terhubung secara akademik
const getFacultyWithNetwork = async (req, res, next) => {
    const session = driver.session();
    try {
        const { name } = req.params;
        const result = await session.run(
            `MATCH (f:Faculty {name: $name})
            OPTIONAL MATCH (f)-[:TEACHES]->(c:Course)<-[:COMPLETED]-(a:Alumni)-[:WORKS_AS]->(ca:Career)
            OPTIONAL MATCH (f)-[:RESEARCHES]->(s:Skill)
            RETURN f, 
            collect(DISTINCT c) AS courses, 
            collect(DISTINCT a) AS students, 
            collect(DISTINCT s) AS skills, 
            collect(DISTINCT ca) AS studentCareers`,
            { name }
        );
        if (result.records.length === 0) {
            return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan' });
        }
        const record = result.records[0];
        const lecturer = record.get('f').properties;
        res.json({
        success: true,
        data: {
            ...lecturer,
            coursesTaught: record.get('courses').map(c => c.properties),
            researchSkills: record.get('skills').map(s => s.properties),
            students: record.get('students').map(a => ({
                name: a.properties.name,
                currentCareer: record.get('studentCareers').find(ca => ca)?.properties.position
            })),
            totalMentoredStudents: record.get('students').length
        }
        });
    } catch (err) {
        next(err);
    } finally {
        await session.close();
    }
};

module.exports = { getAllFaculty, getFacultyWithNetwork };