import React, { useState, useEffect } from 'react';
import { ShieldAlert, Mail, Briefcase, Globe } from 'lucide-react';

function ThreatIntelligence() {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({ total: 0, phishing: 0, recruitment: 0, websites: 0 });

  useEffect(() => {
    // 1. Pull the live history array from local storage
    const savedHistory = JSON.parse(localStorage.getItem('offerLensHistory') || '[]');
    setThreats(savedHistory);

    // 2. Compute dynamic stats based on the scan types
    let phishing = 0;
    let recruitment = 0;
    let websites = 0;

    savedHistory.forEach(item => {
      if (item.type === 'Text Snippet' || item.type === 'Email') phishing += 1;
      if (item.type === 'Document') recruitment += 1;
      if (item.type === 'URL') websites += 1;
    });

    setStats({
      total: savedHistory.length,
      phishing,
      recruitment,
      websites
    });
  }, []);

  return (
    <div className="threat-intel-page">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>Threat Intelligence</h2>
        <p style={{ color: '#85809d', margin: 0, fontSize: '14px' }}>Monitor and investigate suspicious digital activities from your recent AI scans.</p>
      </div>

      <div className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="panel stat-card" style={{ textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ShieldAlert size={28} color="#985bff" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#85809d', fontSize: '13px', marginBottom: '5px' }}>Total Threats</p>
          <h2 style={{ margin: 0, fontSize: '28px' }}>{stats.total}</h2>
        </div>
        
        <div className="panel stat-card" style={{ textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Mail size={28} color="#985bff" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#85809d', fontSize: '13px', marginBottom: '5px' }}>Phishing Attempts</p>
          <h2 style={{ margin: 0, fontSize: '28px' }}>{stats.phishing}</h2>
        </div>
        
        <div className="panel stat-card" style={{ textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Briefcase size={28} color="#985bff" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#85809d', fontSize: '13px', marginBottom: '5px' }}>Recruitment Fraud</p>
          <h2 style={{ margin: 0, fontSize: '28px' }}>{stats.recruitment}</h2>
        </div>
        
        <div className="panel stat-card" style={{ textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Globe size={28} color="#985bff" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#85809d', fontSize: '13px', marginBottom: '5px' }}>Malicious URLs</p>
          <h2 style={{ margin: 0, fontSize: '28px' }}>{stats.websites}</h2>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Detected Threats</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#85809d' }}>Review identified suspicious activities.</p>
          </div>
          <div style={{ background: 'rgba(152, 91, 255, 0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: '#985bff', fontWeight: 'bold' }}>
            {threats.length} Results
          </div>
        </div>

        <div className="table-container">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>THREAT NAME</th>
                <th>CATEGORY</th>
                <th>SEVERITY</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {threats.length > 0 ? threats.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '500' }}>{item.name}</td>
                  <td style={{ color: '#85809d' }}>{item.type}</td>
                  <td>
                    <span className={`risk ${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td style={{ color: '#85809d', fontSize: '13px' }}>{item.date}</td>
                  <td>
                    <span style={{ fontSize: '11px', padding: '4px 8px', background: 'rgba(152, 91, 255, 0.1)', borderRadius: '4px', color: '#985bff', fontWeight: 'bold' }}>
                      Detected
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#85809d' }}>
                    No threats detected yet. Run a scan in 'New Investigation' to populate this list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ThreatIntelligence;