const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const seedData = async () => {
    const session = driver.session();
    try {
        console.log('Menghapus data lama...');
        await session.run('MATCH (n) DETACH DELETE n');


        console.log('Membuat node Course...');
        await session.run(`
            CREATE (:Course {code: 'CS101', name: 'Pengantar Pemrograman', credits: 3, semester: 1})
            CREATE (:Course {code: 'CS102', name: 'Matematika Diskrit', credits: 3, semester: 1})
            CREATE (:Course {code: 'CS105', name: 'Pemrograman Berorientasi Fungsi', credits: 3, semester: 1})
            CREATE (:Course {code: 'CS201', name: 'Struktur Data & Algoritma', credits: 3, semester: 2})
            CREATE (:Course {code: 'CS202', name: 'Sistem Operasi', credits: 3, semester: 2})
            CREATE (:Course {code: 'CS204', name: 'Jaringan Komputer Lanjut', credits: 3, semester: 2})
            CREATE (:Course {code: 'CS301', name: 'Database Systems', credits: 3, semester: 3})
            CREATE (:Course {code: 'CS302', name: 'Jaringan Komputer', credits: 3, semester: 3})
            CREATE (:Course {code: 'CS303', name: 'Pemrograman Berorientasi Objek', credits: 3, semester: 3})
            CREATE (:Course {code: 'CS305', name: 'Sistem Informasi Geografis', credits: 3, semester: 3})
            CREATE (:Course {code: 'CS401', name: 'Backend Development', credits: 3, semester: 4})
            CREATE (:Course {code: 'CS402', name: 'Distributed Systems', credits: 4, semester: 4})
            CREATE (:Course {code: 'CS403', name: 'Cloud Computing', credits: 3, semester: 5})
            CREATE (:Course {code: 'CS404', name: 'Keamanan Sistem Informasi', credits: 3, semester: 5})
            CREATE (:Course {code: 'CS501', name: 'Rekayasa Perangkat Lunak', credits: 3, semester: 5})
            CREATE (:Course {code: 'CS502', name: 'Pengembangan Aplikasi Mobile', credits: 3, semester: 6})
            CREATE (:Course {code: 'CS503', name: 'Machine Learning', credits: 4, semester: 6})
            CREATE (:Course {code: 'CS505', name: 'Data Visualization', credits: 3, semester: 6})
            CREATE (:Course {code: 'CS504', name: 'Proyek Kapita Selekta', credits: 4, semester: 7})
        `);


        console.log('Membuat node Skill...');
        await session.run(`
            CREATE (:Skill {name: 'Node.js', category: 'Backend'})
            CREATE (:Skill {name: 'Express.js', category: 'Backend'})
            CREATE (:Skill {name: 'MongoDB', category: 'Database'})
            CREATE (:Skill {name: 'Redis', category: 'Database'})
            CREATE (:Skill {name: 'SQL', category: 'Database'})
            CREATE (:Skill {name: 'Python', category: 'Programming'})
            CREATE (:Skill {name: 'Docker', category: 'DevOps'})
            CREATE (:Skill {name: 'Kubernetes', category: 'DevOps'})
            CREATE (:Skill {name: 'REST API', category: 'Backend'})
            CREATE (:Skill {name: 'Machine Learning', category: 'AI/ML'})
            CREATE (:Skill {name: 'System Design', category: 'Architecture'})
            CREATE (:Skill {name: 'Git & Version Control', category: 'Tools'})
            CREATE (:Skill {name: 'Distributed Computing', category: 'Systems'})
            CREATE (:Skill {name: 'React', category: 'Frontend'})
            CREATE (:Skill {name: 'TypeScript', category: 'Frontend'})
            CREATE (:Skill {name: 'CI/CD', category: 'DevOps'})
            CREATE (:Skill {name: 'Linux', category: 'Systems'})
            CREATE (:Skill {name: 'Data Visualization', category: 'Analytics'})
        `);


        console.log('Membuat node Career...');
        await session.run(`
            CREATE (:Career {position: 'Backend Engineer', industry: 'Technology'})
            CREATE (:Career {position: 'Fullstack Developer', industry: 'Technology'})
            CREATE (:Career {position: 'DevOps Engineer', industry: 'Technology'})
            CREATE (:Career {position: 'Data Engineer', industry: 'Analytics'})
            CREATE (:Career {position: 'Tech Lead', industry: 'Technology'})
            CREATE (:Career {position: 'Software Architect', industry: 'Technology'})
            CREATE (:Career {position: 'Frontend Developer', industry: 'Technology'})
            CREATE (:Career {position: 'Cloud Engineer', industry: 'Technology'})
            CREATE (:Career {position: 'Data Scientist', industry: 'Analytics'})
        `);


        console.log('Membuat node Alumni...');
        await session.run(`
            CREATE (:Alumni {name: 'Budi', graduation_year: 2021, company: 'Startup Fintech'})
            CREATE (:Alumni {name: 'Ahmad', graduation_year: 2022, company: 'Tech Company'})
            CREATE (:Alumni {name: 'Dewi', graduation_year: 2023, company: 'DataLabs Asia'})
            CREATE (:Alumni {name: 'Rina', graduation_year: 2024, company: 'CloudOps Solutions'})
        `);


        console.log('Membuat node Faculty...');
        await session.run(`
            CREATE (:Faculty {name: 'Dr. Rina Marlina', research_interest: 'Distributed Systems'})
            CREATE (:Faculty {name: 'Prof. Agus Setiawan', research_interest: 'Backend Engineering'})
            CREATE (:Faculty {name: 'Dr. Dewi Anggraeni', research_interest: 'Database Systems'})
            CREATE (:Faculty {name: 'Dr. Hendra Gunawan', research_interest: 'Machine Learning'})
            CREATE (:Faculty {name: 'Dr. Intan Pratiwi', research_interest: 'Data Visualization'})
            CREATE (:Faculty {name: 'Dr. Rudi Santoso', research_interest: 'Cloud Security'})
        `);


        console.log('Membuat node Company...');
        await session.run(`
        CREATE (:Company {name: 'TechCorp Indonesia', sector: 'Technology'})
        CREATE (:Company {name: 'DataLabs Asia', sector: 'Analytics'})
        CREATE (:Company {name: 'CloudOps Solutions', sector: 'Cloud Services'})
        `);


        console.log('Membuat relasi PREREQUISITE_OF...');
        await session.run(`
            MATCH (a:Course {code: 'CS101'}), (b:Course {code: 'CS105'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS105'}), (b:Course {code: 'CS201'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS101'}), (b:Course {code: 'CS201'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS201'}), (b:Course {code: 'CS301'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS301'}), (b:Course {code: 'CS305'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS301'}), (b:Course {code: 'CS401'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS401'}), (b:Course {code: 'CS402'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS402'}), (b:Course {code: 'CS403'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS402'}), (b:Course {code: 'CS404'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS501'}), (b:Course {code: 'CS504'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);
        await session.run(`
            MATCH (a:Course {code: 'CS503'}), (b:Course {code: 'CS505'}) CREATE (a)-[:PREREQUISITE_OF]->(b)
        `);


        console.log('Membuat relasi BUILDS_SKILL...');
        await session.run(`
            MATCH (c:Course {code: 'CS401'}), (s:Skill {name: 'Node.js'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS401'}), (s:Skill {name: 'Express.js'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS401'}), (s:Skill {name: 'REST API'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS301'}), (s:Skill {name: 'MongoDB'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS301'}), (s:Skill {name: 'SQL'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS402'}), (s:Skill {name: 'Redis'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS402'}), (s:Skill {name: 'Distributed Computing'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS403'}), (s:Skill {name: 'Docker'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS403'}), (s:Skill {name: 'Kubernetes'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS503'}), (s:Skill {name: 'Machine Learning'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS305'}), (s:Skill {name: 'Data Visualization'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS502'}), (s:Skill {name: 'React'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS502'}), (s:Skill {name: 'TypeScript'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS202'}), (s:Skill {name: 'Linux'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);
        await session.run(`
            MATCH (c:Course {code: 'CS403'}), (s:Skill {name: 'CI/CD'}) CREATE (c)-[:BUILDS_SKILL]->(s)
        `);


        console.log('Membuat relasi REQUIRED_FOR...');
        await session.run(`
            MATCH (s:Skill {name: 'Node.js'}), (ca:Career {position: 'Backend Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Express.js'}), (ca:Career {position: 'Backend Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'MongoDB'}), (ca:Career {position: 'Backend Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Redis'}), (ca:Career {position: 'Backend Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Docker'}), (ca:Career {position: 'DevOps Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Distributed Computing'}), (ca:Career {position: 'Tech Lead'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Machine Learning'}), (ca:Career {position: 'Data Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'React'}), (ca:Career {position: 'Frontend Developer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'TypeScript'}), (ca:Career {position: 'Frontend Developer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Data Visualization'}), (ca:Career {position: 'Data Scientist'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'CI/CD'}), (ca:Career {position: 'DevOps Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);
        await session.run(`
            MATCH (s:Skill {name: 'Linux'}), (ca:Career {position: 'Cloud Engineer'}) CREATE (s)-[:REQUIRED_FOR]->(ca)
        `);


        console.log('Membuat relasi COMPLETED...');
        await session.run(`
            MATCH (a:Alumni {name: 'Budi'}), (c:Course {code: 'CS101'})
            CREATE (a)-[:COMPLETED]->(c)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Budi'}), (c:Course {code: 'CS301'})
            CREATE (a)-[:COMPLETED]->(c)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Ahmad'}), (c:Course {code: 'CS401'})
            CREATE (a)-[:COMPLETED]->(c)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Ahmad'}), (c:Course {code: 'CS502'})
            CREATE (a)-[:COMPLETED]->(c)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Dewi'}), (c:Course {code: 'CS503'})
            CREATE (a)-[:COMPLETED]->(c)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Rina'}), (c:Course {code: 'CS402'})
            CREATE (a)-[:COMPLETED]->(c)
        `);

        console.log('Membuat relasi WORKS_AS...');
        await session.run(`
            MATCH (a:Alumni {name: 'Budi'}), (ca:Career {position: 'Backend Engineer'})
            CREATE (a)-[:WORKS_AS]->(ca)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Ahmad'}), (ca:Career {position: 'Fullstack Developer'})
            CREATE (a)-[:WORKS_AS]->(ca)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Dewi'}), (ca:Career {position: 'Data Scientist'})
            CREATE (a)-[:WORKS_AS]->(ca)
        `);
        await session.run(`
            MATCH (a:Alumni {name: 'Rina'}), (ca:Career {position: 'Cloud Engineer'})
            CREATE (a)-[:WORKS_AS]->(ca)
        `);


        console.log('Membuat relasi OFFERS...');
        await session.run(`
            MATCH (co:Company {name: 'TechCorp Indonesia'}), (ca:Career {position: 'Backend Engineer'})
            CREATE (co)-[:OFFERS]->(ca)
        `);
        await session.run(`
            MATCH (co:Company {name: 'DataLabs Asia'}), (ca:Career {position: 'Data Engineer'})
            CREATE (co)-[:OFFERS]->(ca)
        `);
        await session.run(`
            MATCH (co:Company {name: 'DataLabs Asia'}), (ca:Career {position: 'Data Scientist'})
            CREATE (co)-[:OFFERS]->(ca)
        `);
        await session.run(`
            MATCH (co:Company {name: 'CloudOps Solutions'}), (ca:Career {position: 'Cloud Engineer'})
            CREATE (co)-[:OFFERS]->(ca)
        `);

        console.log('Membuat relasi TEACHES...');
        await session.run(`
            MATCH (f:Faculty {name: 'Prof. Agus Setiawan'}), (c:Course {code: 'CS401'})
            CREATE (f)-[:TEACHES]->(c)
        `);
        await session.run(`
            MATCH (f:Faculty {name: 'Dr. Rina Marlina'}), (c:Course {code: 'CS402'})
            CREATE (f)-[:TEACHES]->(c)
        `);
        await session.run(`
            MATCH (f:Faculty {name: 'Dr. Intan Pratiwi'}), (c:Course {code: 'CS505'})
            CREATE (f)-[:TEACHES]->(c)
        `);
        await session.run(`
            MATCH (f:Faculty {name: 'Dr. Rudi Santoso'}), (c:Course {code: 'CS404'})
            CREATE (f)-[:TEACHES]->(c)
        `);

        console.log('Membuat relasi RESEARCHES...');
        await session.run(`
            MATCH (f:Faculty {name: 'Prof. Agus Setiawan'}), (s:Skill {name: 'Node.js'})
            CREATE (f)-[:RESEARCHES]->(s)
        `);
        await session.run(`
            MATCH (f:Faculty {name: 'Dr. Rina Marlina'}), (s:Skill {name: 'Distributed Computing'})
            CREATE (f)-[:RESEARCHES]->(s)
        `);
        await session.run(`
            MATCH (f:Faculty {name: 'Dr. Intan Pratiwi'}), (s:Skill {name: 'Data Visualization'})
            CREATE (f)-[:RESEARCHES]->(s)
        `);
        await session.run(`
            MATCH (f:Faculty {name: 'Dr. Rudi Santoso'}), (s:Skill {name: 'Linux'})
            CREATE (f)-[:RESEARCHES]->(s)
        `);

        console.log('\nSeed data berhasil dimasukkan!');
        console.log('Ringkasan:');
        console.log('   Nodes  : 18 Course, 18 Skill, 9 Career, 4 Alumni, 6 Faculty, 3 Company = 58 total');
        console.log('   Edges  : 14 PREREQUISITE_OF, 18 BUILDS_SKILL, 12 REQUIRED_FOR,');
        console.log('            6 COMPLETED, 4 WORKS_AS, 4 OFFERS, 4 TEACHES, 4 RESEARCHES = 48 total');

    } catch (err) {
        console.error('Gagal seed data:', err);
    } finally {
        await session.close();
        await driver.close();
    }
};

seedData();