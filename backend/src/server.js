const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const courseRoutes = require('./routes/courses');
const careerRoutes = require('./routes/careers');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/graph', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m'
    );
    
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

app.post('/api/auth/sso', (req, res) => {
  const { sso_id } = req.body;
  if (sso_id) {
    res.json({ success: true, token: "dummy_jwt_token", sso_id });
  } else {
    res.status(401).json({ success: false, message: "SSO ID diperlukan" });
  }
});

app.post('/api/alumni/update', async (req, res) => {
  const { sso_id, position, company } = req.body;
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {sso_id: $sso_id})
       MERGE (car:Career {position: $position})
       MERGE (comp:Company {name: $company})
       MERGE (u)-[:WORKS_AS]->(car)
       MERGE (u)-[:WORKS_AT]->(comp)`,
      { sso_id, position, company }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

app.use('/api/courses', courseRoutes);
app.use('/api/careers', careerRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});