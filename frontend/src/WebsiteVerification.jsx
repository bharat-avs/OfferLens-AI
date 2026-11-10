import React, { useState } from 'react';
import {
  Globe,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';

import './WebsiteVerification.css';

function WebsiteVerification() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const analyseWebsite = () => {
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a website URL.');
      return;
    }

    let website;

    try {
      const formattedUrl = /^https?:\/\//i.test(url)
        ? url
        : `https://${url}`;

      website = new URL(formattedUrl);

      if (!website.hostname.includes('.')) {
        throw new Error('Invalid website');
      }
    } catch {
      setError('Please enter a valid website URL.');
      return;
    }

    setLoading(true);

    // Frontend demonstration only.
    // Real website verification will be connected through the backend.

    setTimeout(() => {
      const warnings = [];

      if (website.protocol !== 'https:') {
        warnings.push('Website does not use a secure HTTPS connection.');
      }

      if (website.hostname.includes('-')) {
        warnings.push('Website domain contains hyphens.');
      }

      if (website.hostname.split('.').length > 3) {
        warnings.push('Website uses multiple subdomains.');
      }

      if (website.hostname.length > 30) {
        warnings.push('Website has an unusually long domain name.');
      }

      const riskScore = Math.min(warnings.length * 20, 80);

      setResult({
        domain: website.hostname,
        score: riskScore,
        warnings,
        status:
          riskScore >= 60
            ? 'High Risk'
            : riskScore >= 20
            ? 'Needs Attention'
            : 'Low Risk',
      });

      setLoading(false);
    }, 1200);
  };

  const resetAnalysis = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  return (
    <div className="website-page">

      <div className="website-heading">
        <div>
          <h2>Website Verification</h2>
          <p>
            Analyse website URLs and identify potential security warning signs.
          </p>
        </div>

        <div className="website-heading-icon">
          <Globe size={25} />
        </div>
      </div>

      <div className="website-input-panel">

        <div className="website-panel-title">
          <div className="website-icon">
            <Search size={20} />
          </div>

          <div>
            <h3>Verify a Website</h3>
            <p>Enter the website URL you want to investigate.</p>
          </div>
        </div>

        <label htmlFor="website-url">Website URL</label>

        <div className="website-input-wrapper">
          <Globe size={19} />

          <input
            id="website-url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') analyseWebsite();
            }}
          />

          {url && (
            <button
              className="website-clear"
              onClick={resetAnalysis}
              type="button"
            >
              Clear
            </button>
          )}
        </div>

        {error && <p className="website-error">{error}</p>}

        <button
          className="website-analyse-btn"
          onClick={analyseWebsite}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="website-spin" />
              Analysing Website...
            </>
          ) : (
            <>
              <Search size={18} />
              Verify Website
            </>
          )}
        </button>

        <div className="website-security-note">
          <Lock size={15} />
          <span>
            Your URL is processed by this frontend demonstration.
          </span>
        </div>
      </div>

      {!result && (
        <div className="website-empty-state">
          <div className="website-empty-icon">
            <ShieldCheck size={35} />
          </div>

          <h3>Ready to Verify</h3>

          <p>
            Enter a website URL above to see a demonstration of the
            verification report.
          </p>
        </div>
      )}

      {result && (
        <div className="website-results">

          <div className="website-result-header">
            <div>
              <h3>Verification Report</h3>
              <p>Analysis results for {result.domain}</p>
            </div>

            <span
              className={`website-status ${
                result.score >= 60
                  ? 'status-high'
                  : result.score >= 20
                  ? 'status-medium'
                  : 'status-low'
              }`}
            >
              {result.status}
            </span>
          </div>

          <div className="website-result-grid">

            <div className="website-score-card">
              <div className="website-score-icon">
                {result.score >= 60 ? (
                  <ShieldAlert size={23} />
                ) : (
                  <ShieldCheck size={23} />
                )}
              </div>

              <p>Risk Score</p>

              <h2>{result.score}<span>/100</span></h2>

              <div className="website-score-bar">
                <div
                  style={{ width: `${result.score}%` }}
                />
              </div>

              <small>
                {result.score === 0
                  ? 'No basic warning signs detected.'
                  : 'Potential warning signs detected.'}
              </small>
            </div>

            <div className="website-details-card">
              <h4>
                <Globe size={18} />
                Website Details
              </h4>

              <div className="website-detail-row">
                <span>Domain</span>
                <strong>{result.domain}</strong>
              </div>

              <div className="website-detail-row">
                <span>Connection</span>
                <strong>
                  {url.startsWith('http://')
                    ? 'HTTP'
                    : 'HTTPS or assumed HTTPS'}
                </strong>
              </div>

              <div className="website-detail-row">
                <span>Warning Signs</span>
                <strong>{result.warnings.length}</strong>
              </div>
            </div>

          </div>

          <div className="website-warning-card">

            <h4>
              <AlertTriangle size={19} />
              Detected Warning Signs
            </h4>

            {result.warnings.length > 0 ? (
              result.warnings.map((warning, index) => (
                <div className="website-warning-item" key={index}>
                  <AlertTriangle size={17} />
                  <span>{warning}</span>
                </div>
              ))
            ) : (
              <div className="website-safe-message">
                <CheckCircle size={19} />
                <span>
                  No basic URL warning signs were detected.
                </span>
              </div>
            )}

          </div>

          <div className="website-recommendation">
            <ShieldCheck size={22} />

            <div>
              <h4>Safety Recommendation</h4>

              <p>
                {result.score >= 60
                  ? 'Avoid entering personal information or making payments until the website has been independently verified.'
                  : result.score >= 20
                  ? 'Proceed carefully. Verify the website owner and company details before sharing sensitive information.'
                  : 'No basic URL warning signs were detected. This does not guarantee that the website is safe.'}
              </p>
            </div>
          </div>

          <div className="website-disclaimer">
            <ExternalLink size={15} />
            <span>
              This is a preliminary frontend demonstration, not a
              real-time security scan. Backend AI and domain reputation
              verification will be integrated later.
            </span>
          </div>

        </div>
      )}

    </div>
  );
}

export default WebsiteVerification;