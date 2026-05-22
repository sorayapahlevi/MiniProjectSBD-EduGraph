const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyConnectivity } = require('./config/neo4j');
const courseRoutes = require('./routes/courses');
const skillRoutes = require('./routes/skills');
const careerRoutes = require('./routes/careers');
const alumniRoutes = require('./routes/alumni');
const facultyRoutes = require('./routes/faculty');
const graphRoutes = require('./routes/graph');
const errorHandler = require('./middleware/errorHandler');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'EduGraph API is running', timestamp: new Date() });
});

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
    await verifyConnectivity();
    console.log(`Server berjalan di http://localhost:${PORT}`);
});