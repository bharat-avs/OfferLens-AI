import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Globe,
  FileSearch,
  Activity,
  Lock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

import './RiskAnalysis.css';

// Default mockup data used ONLY if no analysis has been run yet
const defaultRiskFactors = [
  { name: 'Awaiting Analysis', score: 0, level: 'None', color: '#312e42' }
];

function RiskAnalysis() {
  const [aiData, setAiData] = useState(null);

  // Load the real data from sessionStorage when the page opens
  useEffect(() => {
    const storedData = sessionStorage.getItem('offerLensAnalysis');
    if (storedData) {
      setAiData(JSON.parse(storedData));
    }
  }, []);

  // Map the AI response flags to the UI components
  const activeFactors = aiData && aiData.flags ? aiData.flags.map((flag, idx) => ({
    name: flag,
    score: Math.max(40, 100 - (idx * 15)), // UI visual scaling
    level: aiData.severity || 'High',
    color: aiData.severity === 'Critical' ? '#ef4444' : '#f97316'
  })) : defaultRiskFactors;

  // Real Score vs Fallback
  const score = aiData ? (aiData.overall_score || aiData.risk_score || 85) : 0;
  const isCritical = score >= 80;

  return (
    <div className="risk-page">
      <div className="risk-heading">
        <div>
          <span className="risk-label">SECURITY INSIGHTS</span>
          <h1>Risk Analysis</h1>
          <p>
            {aiData ? `AI Analysis Results for: ${aiData.filename || 'Pasted Text'}` : 'Understand fraud patterns, risk factors and potential security threats.'}
          </p>
        </div>

        <div className="risk-status" style={{ backgroundColor: aiData ? '#ef4444' : ''}}>
          <Activity size={17} />
          {aiData ? 'Live AI Analysis' : 'Awaiting Input'}
        </div>
      </div>

      <div className="risk-overview-grid">
        <div className="overall-risk-card">
          <div className="risk-card-top">
            <div>
              <p>Overall Risk Score</p>
              <h2>{score}<span>/100</span></h2>
            </div>

            <div className="risk-icon critical-icon" style={{ backgroundColor: isCritical ? '#ef444420' : '#22c55e20', color: isCritical ? '#ef4444' : '#22c55e' }}>
              {isCritical ? <ShieldAlert size={25} /> : <ShieldCheck size={25} />}
            </div>
          </div>

          <div className="risk-meter">
            <div className="risk-meter-fill" style={{ width: `${score}%`, backgroundColor: isCritical ? '#ef4444' : '#22c55e' }} />
          </div>

          <div className="risk-card-bottom">
            <span className="critical-badge" style={{ backgroundColor: isCritical ? '#ef4444' : '#22c55e' }}>
              {isCritical ? 'HIGH RISK' : 'SAFE'}
            </span>
            <span>{isCritical ? 'Requires immediate attention' : 'No major threats detected'}</span>
          </div>
        </div>

        <div className="risk-stat-card">
          <div className="risk-stat-icon red-stat">
            <AlertTriangle size={22} />
          </div>
          <p>Critical Indicators</p>
          <h2>{aiData ? (aiData.flags ? aiData.flags.length : 0) : 0}</h2>
          <span className="stat-note">Flags identified by BharatCode AI</span>
        </div>

        <div className="risk-stat-card" style={{ gridColumn: 'span 2' }}>
          <div className="risk-stat-icon orange-stat">
            <FileSearch size={22} />
          </div>
          <p>AI Explanation</p>
          <span style={{ display: 'block', marginTop: '10px', color: '#d1d5db', lineHeight: '1.5' }}>
            {aiData ? aiData.analysis : "Upload a document in the 'New Investigation' tab to see the AI breakdown here."}
          </span>
        </div>
      </div>

      <div className="risk-content-grid">
        <section className="risk-panel">
          <div className="risk-panel-heading">
            <div>
              <h3>Risk Factor Breakdown</h3>
              <p>Contribution of different factors to the AI risk score.</p>
            </div>
            <Activity size={20} />
          </div>

          <div className="factor-list">
            {activeFactors.map((factor) => (
              <div className="factor-item" key={factor.name}>
                <div className="factor-info">
                  <span>{factor.name}</span>
                  <span className="factor-level">{factor.level}</span>
                </div>

                <div className="factor-track">
                  <div
                    className="factor-fill"
                    style={{
                      width: `${factor.score}%`,
                      backgroundColor: factor.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="risk-panel">
          <div className="risk-panel-heading">
            <div>
              <h3>Recommended Action</h3>
              <p>Security guidance based on analysis.</p>
            </div>
            <ShieldCheck size={20} />
          </div>
          
          <div style={{ padding: '20px', color: '#e5e7eb', lineHeight: '1.6' }}>
             {isCritical 
                ? "WARNING: This opportunity exhibits multiple high-risk indicators of fraud. Do NOT provide personal identification, banking details, or upfront payments. Block the sender."
                : "Proceed with caution. While no critical flags were detected, always verify the source independently before sharing sensitive data."}
          </div>
        </section>
      </div>

      {!aiData && (
        <div className="risk-disclaimer">
          <AlertTriangle size={16} />
          Awaiting input. Please submit a file or text in the New Investigation tab to generate a live report.
        </div>
      )}
    </div>
  );
}

export default RiskAnalysis;