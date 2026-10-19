const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// ROUTE 1: Health Check
// ============================================
app.get('/api/health', (req, res) => {
  console.log('✅ Health check received');
  res.json({ 
    status: 'ok', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ROUTE 2: Analyze Resume (Mock Data)
// ============================================
app.post('/api/analyze', (req, res) => {
  console.log('📥 Analysis request received');
  
  try {
    // Mock result - replace with real AI later
    const mockResult = {
      overallScore: 85,
      skillsMatch: 90,
      experienceMatch: 80,
      summary: 'Your resume has a strong match with this job. You have most of the required skills and experience.',
      strengths: [
        'Good experience with React and JavaScript',
        'Strong problem-solving and debugging skills',
        'Experience with databases and backend development',
        'Knowledge of REST APIs and web services'
      ],
      gaps: [
        'Missing some advanced TypeScript knowledge',
        'Could improve knowledge of cloud services like AWS',
        'Limited experience with DevOps and CI/CD pipelines',
        'Need to learn more about system design'
      ],
      recommendations: [
        'Learn TypeScript to enhance your JavaScript skills',
        'Take an AWS certification course to boost cloud knowledge',
        'Build a project using Docker and Kubernetes',
        'Study system design patterns and best practices'
      ]
    };

    console.log('✅ Sending mock results');
    res.json(mockResult);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({ error: err.message });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}\n`);
  console.log('Available endpoints:');
  console.log('  GET  http://localhost:${PORT}/api/health');
  console.log('  POST http://localhost:${PORT}/api/analyze');
  console.log('\n');
});