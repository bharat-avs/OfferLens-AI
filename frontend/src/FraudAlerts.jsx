import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, Search, Filter, Briefcase, Mail, Globe } from 'lucide-react';

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ critical: 0, high: 0, active: 0, resolved: 0 });

  useEffect(() => {
    // 1. Fetch live history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('offerLensHistory') || '[]');
    
    // 2. Add default 'New' status and mock descriptions for older scans
    const formattedAlerts = savedHistory.map(item => ({
      ...item,
      status: item.status || 'New',
      description: item.description || (
        item.type === 'Document' ? 'Suspicious document analysis requires review.' : 
        (item.type === 'URL' ? 'Potentially malicious website link flagged.' : 'Suspicious text or email detected.')
      )
    }));
    
    setAlerts(formattedAlerts);
    calculateStats(formattedAlerts);
  }, []);

  const calculateStats = (currentAlerts) => {
    let critical = 0;
    let high = 0;
    let active = 0;
    let resolved = 0;

    currentAlerts.forEach(alert => {
      if (alert.severity === 'Critical') critical += 1;
      if (alert.severity === 'High') high += 1;
      
      if (alert.status === 'Resolved') {
        resolved += 1;
      } else {
        active += 1;
      }
    });

    setStats({ critical, high, active, resolved });
  };

  const handleStatusChange = (id, newStatus) => {
    // Update local state UI
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    );
    setAlerts(updatedAlerts);
    calculateStats(updatedAlerts);

    // Save the new status back to the database
    const history = JSON.parse(localStorage.getItem('offerLensHistory') || '[]');
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    localStorage.setItem('offerLensHistory', JSON.stringify(updatedHistory));
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f59e0b'; // Orange
      case 'Medium': return '#22c55e'; // Green
      default: return '#3b82f6'; // Blue
    }
  };

  const getIcon = (type) => {
    if (type === 'Document') return <Briefcase size={20} />;
    if (type === 'URL') return <Globe size={20} />;
    return <Mail size={20} />;
  };

  return (
    <div className="fraud-alerts-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <span style={{ color: '#985bff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>SECURITY MONITORING</span>
          <h2 style={{ fontSize: '26px', margin: '8px 0 5px 0' }}>Fraud Alerts</h2>
          <p style={{ color: '#85809d', margin: 0, fontSize: '14px' }}>Monitor suspicious activities and potential digital fraud.</p>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#22c55e' }}>
          <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
          Alert Monitoring
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="panel stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}><ShieldAlert size={24} /></div>
          <p style={{ color: '#85809d', fontSize: '13px', margin: '0 0 10px 0' }}>Critical Alerts</p>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>{stats.critical}</h2>
          <p style={{ color: '#85809d', fontSize: '11px', margin: 0 }}>Requires immediate attention</p>
        </div>

        <div className="panel stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}><AlertTriangle size={24} /></div>
          <p style={{ color: '#85809d', fontSize: '13px', margin: '0 0 10px 0' }}>High Risk Alerts</p>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>{stats.high}</h2>
          <p style={{ color: '#85809d', fontSize: '11px', margin: 0 }}>Potential security threats</p>
        </div>

        <div className="panel stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(152, 91, 255, 0.1)', color: '#985bff', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}><Clock size={24} /></div>
          <p style={{ color: '#85809d', fontSize: '13px', margin: '0 0 10px 0' }}>Active Alerts</p>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>{stats.active}</h2>
          <p style={{ color: '#85809d', fontSize: '11px', margin: 0 }}>New and under investigation</p>
        </div>

        <div className="panel stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}><CheckCircle2 size={24} /></div>
          <p style={{ color: '#85809d', fontSize: '13px', margin: '0 0 10px 0' }}>Resolved Alerts</p>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>{stats.resolved}</h2>
          <p style={{ color: '#85809d', fontSize: '11px', margin: 0 }}>Marked as resolved</p>
        </div>
      </div>

      <div className="panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Detected Fraud Alerts</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#85809d' }}>Review and manage suspicious activities.</p>
          </div>
          <div style={{ background: 'rgba(152, 91, 255, 0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: '#985bff', fontWeight: 'bold' }}>
            {filteredAlerts.length} Alerts
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '12px', color: '#85809d' }} />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 45px', background: '#252331', border: '1px solid #353047', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '0 20px', background: '#252331', border: '1px solid #353047', borderRadius: '8px', color: '#85809d', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Filter size={16} /> All Severities
            </button>
            <button style={{ padding: '0 20px', background: '#252331', border: '1px solid #353047', borderRadius: '8px', color: '#85809d', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              All Statuses
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
            <div key={alert.id} style={{ display: 'flex', alignItems: 'center', background: '#1e1b29', border: '1px solid #2d2a3d', padding: '20px', borderRadius: '12px', gap: '20px' }}>
              
              <div style={{ background: `${getSeverityColor(alert.severity)}15`, color: getSeverityColor(alert.severity), padding: '15px', borderRadius: '10px', flexShrink: 0 }}>
                {getIcon(alert.type)}
              </div>
              
              <div style={{ flex: 1.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px' }}>{alert.name}</h4>
                  <span style={{ background: `${getSeverityColor(alert.severity)}20`, color: getSeverityColor(alert.severity), padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                    {alert.severity}
                  </span>
                </div>
                <div style={{ color: '#85809d', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{alert.type}</span> • <span>{alert.date}</span>
                </div>
              </div>

              <div style={{ flex: 2, color: '#85809d', fontSize: '13px', paddingRight: '20px' }}>
                {alert.description}
              </div>

              <div style={{ flexShrink: 0 }}>
                <select 
                  value={alert.status}
                  onChange={(e) => handleStatusChange(alert.id, e.target.value)}
                  style={{ 
                    padding: '8px 15px', 
                    background: alert.status === 'Resolved' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(152, 91, 255, 0.1)', 
                    border: '1px solid transparent', 
                    borderRadius: '6px', 
                    color: alert.status === 'Resolved' ? '#22c55e' : '#985bff', 
                    fontWeight: 'bold',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="New" style={{ background: '#252331', color: '#fff' }}>New</option>
                  <option value="Investigating" style={{ background: '#252331', color: '#fff' }}>Investigating</option>
                  <option value="Resolved" style={{ background: '#252331', color: '#fff' }}>Resolved</option>
                </select>
              </div>

            </div>
          )) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#85809d' }}>
              <ShieldAlert size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
              <p>No fraud alerts detected in your database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FraudAlerts;