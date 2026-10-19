import React, { useState } from 'react';

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('❌ Please select a resume file');
      return;
    }

    if (!jobDescription.trim()) {
      setError('❌ Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API returned error: ' + response.status);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="max-w-2xl">
        
        <div className="text-center">
          <h1>🔵 AI Resume Analyzer</h1>
          <p className="subtitle">Get instant feedback on your resume</p>
        </div>

        <div className="card">
          
          <div className="form-group">
            <label>📥 Upload Your Resume</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
            {resumeFile && (
              <p className="success-text">✓ {resumeFile.name}</p>
            )}
          </div>

          <div className="form-group">
            <label>📝 Paste Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Copy-paste the job description here..."
            />
            <p className="helper-text">Minimum 50 characters</p>
          </div>

          {error && (
            <div className="error-box">⚠️ {error}</div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeFile || !jobDescription.trim()}
          >
            {loading ? '⟳ Analyzing with AI...' : '🚀 Analyze Resume'}
          </button>
        </div>

        {result && (
          <div className="results">
            <h2>📊 Results</h2>
            
            <div className="score-box">
              <p>Overall Score</p>
              <div className="score-number">{result.overallScore}%</div>
            </div>

            <div className="summary-box">
              <h3>Summary</h3>
              <p>{result.summary}</p>
            </div>

            {result.strengths && (
              <div className="strengths">
                <h3>✅ Strengths</h3>
                <ul>
                  {result.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.gaps && (
              <div className="gaps">
                <h3>⚠️ Areas to Improve</h3>
                <ul>
                  {result.gaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}