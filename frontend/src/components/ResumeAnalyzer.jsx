import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
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

      console.log('Sending to backend...');
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API returned error: ' + response.status);
      }

      const data = await response.json();
      console.log('Got result:', data);
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-slate-300">Get instant feedback on your resume</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 shadow-2xl">
          
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Upload Your Resume
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer hover:bg-slate-600"
            />
            {resumeFile && (
              <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {resumeFile.name}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Copy-paste the job description here..."
              className="w-full h-48 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
            <p className="text-slate-400 text-sm mt-2">Minimum 50 characters</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeFile || !jobDescription.trim()}
            className={`w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading || !resumeFile || !jobDescription.trim()
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              '🚀 Analyze Resume'
            )}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-slate-800 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">📊 Results</h2>
            
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
              <p className="text-slate-400 text-sm mb-2">Overall Score</p>
              <p className="text-5xl font-bold text-blue-400">
                {result.overallScore}%
              </p>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-2">Summary</h3>
              <p className="text-slate-300">{result.summary}</p>
            </div>

            {result.strengths && (
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-6 mb-6">
                <h3 className="text-green-400 font-semibold mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-slate-300 flex gap-2">
                      <span className="text-green-400">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.gaps && (
              <div className="bg-orange-900/20 border border-orange-600 rounded-lg p-6">
                <h3 className="text-orange-400 font-semibold mb-3">⚠️ Areas to Improve</h3>
                <ul className="space-y-2">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="text-slate-300 flex gap-2">
                      <span className="text-orange-400">!</span> {g}
                    </li>
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