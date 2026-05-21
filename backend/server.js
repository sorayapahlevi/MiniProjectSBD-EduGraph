const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { verifyConnectivity } = require('./src/config/neo4j');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

verifyConnectivity();

app.use('/api/alumni', require('./src/routes/alumni'));
app.use('/api/careers', require('./src/routes/careers'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/faculty', require('./src/routes/faculty'));
app.use('/api/skills', require('./src/routes/skills'));
app.use('/api/graph', require('./src/routes/graph'));
app.use('/api/auth', require('./src/routes/auth'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});