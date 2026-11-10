import React, { useState, useEffect } from 'react';
import { History, Search, Download, Trash2 } from 'lucide-react';
import './InvestigationHistory.css';

function InvestigationHistory() {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    // Load the history database that NewInvestigation.jsx just saved to
    const saved = JSON.parse(localStorage.getItem('offerLensHistory') || '[]');
    setHistoryList(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('offerLensHistory');
    setHistoryList([]);
  };

  return (
    <div className="panel">
      <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><History size={20} /> Investigation History</h3>
          <p style={{ color: '#85809d', fontSize: '13px', marginTop: '5px' }}>Review your past AI scans and reports.</p>
        </div>
        {historyList.length > 0 && (
          <button onClick={clearHistory} style={{ background: '#ef405520', color: '#ef4055', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {historyList.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#85809d' }}>
          <Search size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
          <p>No investigations found. Run a new scan to see it here.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ASSET NAME</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>RISK SCORE</th>
                <th>SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: '#85809d', fontSize: '12px' }}>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td style={{ color: '#85809d' }}>{item.date}</td>
                  <td>{item.score}/100</td>
                  <td>
                    <span className={`risk ${item.severity.toLowerCase()}`}>
                      {item.severity} Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InvestigationHistory;