import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image,
  Link,
  Mail,
  Search,
  ShieldCheck,
  X,
  Loader2
} from 'lucide-react';

import './NewInvestigation.css';

function NewInvestigation() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setResult('');
  };

  const handleAnalyze = async () => {
    if (!url && !message && !file) {
      setResult('Please enter a URL, message or upload a file.');
      return;
    }

    setIsAnalyzing(true);
    setResult('Sending to OfferLens AI for analysis...');

    try {
      let response;
      
      // 1. If a file is uploaded, send it to the PDF route
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        // UPDATED: Now uses relative path for the Vite proxy
        response = await fetch('/api/scan/file', {
          method: 'POST',
          body: formData,
        });
      } 
      // 2. If text or URL is pasted, send it to the text route
      else {
        const formData = new FormData();
        formData.append('text', message || url);
        
        // UPDATED: Now uses relative path for the Vite proxy
        response = await fetch('/api/scan/text', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      sessionStorage.setItem('offerLensAnalysis', JSON.stringify(data));
      
      // ADD THIS: Push the new scan into the Investigation History local database
      const existingHistory = JSON.parse(localStorage.getItem('offerLensHistory') || '[]');
      const newHistoryItem = {
        id: `INV-${Math.floor(Math.random() * 10000)}`,
        name: file ? file.name : (url ? url : "Pasted Text Analysis"),
        type: file ? "Document" : (url ? "URL" : "Text Snippet"),
        score: data.overall_score || data.score,
        severity: data.severity,
        date: new Date().toLocaleDateString()
      };
      localStorage.setItem('offerLensHistory', JSON.stringify([newHistoryItem, ...existingHistory]));
      
      setResult('Analysis Complete! Please click the "Risk Analysis" tab on the left to view your AI Security Report.');
      
      // Save the real AI data to sessionStorage so RiskAnalysis.jsx can read it
      sessionStorage.setItem('offerLensAnalysis', JSON.stringify(data));
      
      setResult('Analysis Complete! Please click the "Risk Analysis" tab on the left to view your AI Security Report.');
      
    } catch (error) {
      console.error(error);
      setResult('Error connecting to backend. Please ensure the Python server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="investigation-page">
      <div className="investigation-heading">
        <div>
          <h1>New Investigation</h1>
          <p>Analyse suspicious digital opportunities and potential threats.</p>
        </div>

        <div className="secure-badge">
          <ShieldCheck size={16} />
          Secure Analysis
        </div>
      </div>

      <div className="investigation-grid">
        <div className="investigation-card">
          <div className="card-heading">
            <FileText size={21} />
            <div>
              <h3>Upload Documents</h3>
              <p>Upload suspicious documents or screenshots.</p>
            </div>
          </div>

          <label className="upload-area">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFile}
              hidden
            />
            <UploadCloud size={38} />
            <h3>Drop your file here</h3>
            <p>or click to browse files</p>
            <span>PDF, PNG, JPG, JPEG (Max 10 MB)</span>
          </label>

          {file && (
            <div className="selected-file">
              <FileText size={18} />
              <span>{file.name}</span>
              <button onClick={() => setFile(null)}>
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="investigation-card">
          <div className="card-heading">
            <Link size={21} />
            <div>
              <h3>Website Verification</h3>
              <p>Check suspicious websites and recruitment links.</p>
            </div>
          </div>

          <label>Website URL</label>
          <div className="input-box">
            <Link size={18} />
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <p className="input-hint">
            Enter the website or job application link you want to verify.
          </p>
        </div>

        <div className="investigation-card full-width">
          <div className="card-heading">
            <Mail size={21} />
            <div>
              <h3>Suspicious Message Analysis</h3>
              <p>Paste suspicious emails, job offers or messages.</p>
            </div>
          </div>

          <textarea
            placeholder="Paste your suspicious email, internship offer, recruitment message or advertisement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="textarea-footer">
            <span>{message.length} characters</span>
          </div>
        </div>
      </div>

      <div className="analysis-action">
        <div>
          <ShieldCheck size={20} />
          <span>Your information is ready for investigation.</span>
        </div>

        <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ opacity: isAnalyzing ? 0.7 : 1 }}>
          {isAnalyzing ? <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Analyzing...</span> : <><Search size={18} /> Analyse Now</>}
        </button>
      </div>

      {result && (
        <div className="analysis-message" style={{ backgroundColor: result.includes('Complete') ? '#059669' : '#312e42', color: 'white', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default NewInvestigation;