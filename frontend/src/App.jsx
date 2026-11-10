import React, { useState, useEffect } from 'react';
import Login from './Login';
import {
  ShieldCheck, Search, Globe, Bell, LayoutDashboard, History, Activity, Lock, Settings, ShieldAlert, Trash2,
} from 'lucide-react';

import './App.css';

import NewInvestigation from './NewInvestigation';
import ThreatIntelligence from './ThreatIntelligence';
import InvestigationHistory from './InvestigationHistory';
import RiskAnalysis from './RiskAnalysis';
import FraudAlerts from './FraudAlerts';
import SettingsPage from './Settings';

function App() {
  // Checks if user previously logged in
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('offerLensAuth') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('offerLensAuth', 'true');
  };

  const [activePage, setActivePage] = useState('Dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('offerLensTheme') || 'dark');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [kpiData, setKpiData] = useState({
    total_scans: 0,
    high_risk_detected: 0,
    phishing_urls: 0,
    active_alerts: 0
  });

  const syncNotifications = () => {
    try {
      const history = JSON.parse(localStorage.getItem('offerLensHistory') || '[]');
      const settings = JSON.parse(localStorage.getItem('offerLensSettings') || '{}');
      const dismissed = JSON.parse(localStorage.getItem('offerLensDismissedNotifs') || '[]');

      const isCriticalEnabled = settings.criticalAlerts !== false;
      const isHighEnabled = settings.highRisk !== false;
      const isSummaryEnabled = settings.weeklySummary === true;

      const dynamicList = [];

      history.forEach((item) => {
        const severity = (item.severity || '').toLowerCase();
        const critId = `crit-${item.id}`;
        const highId = `high-${item.id}`;

        if (severity === 'critical' && isCriticalEnabled && !dismissed.includes(critId)) {
          dynamicList.push({
            id: critId,
            type: 'critical',
            text: `Critical Threat: ${item.name || 'Suspicious Asset'} flagged (${item.score || 90}/100)`,
            time: item.date || 'Recent'
          });
        } else if (severity === 'high' && isHighEnabled && !dismissed.includes(highId)) {
          dynamicList.push({
            id: highId,
            type: 'high',
            text: `High Risk Detected: ${item.name || 'Suspicious Asset'} (${item.score || 75}/100)`,
            time: item.date || 'Recent'
          });
        }
      });

      if (isSummaryEnabled && !dismissed.includes('summary-alert')) {
        dynamicList.push({
          id: 'summary-alert',
          type: 'summary',
          text: `Weekly Summary: ${history.length} investigation${history.length === 1 ? '' : 's'} recorded this week.`,
          time: 'Active'
        });
      }

      setNotifications(dynamicList);
    } catch (err) {
      console.error("Error reading notifications:", err);
    }
  };

  const handleDismissNotification = (id) => {
    const dismissed = JSON.parse(localStorage.getItem('offerLensDismissedNotifs') || '[]');
    const updatedDismissed = [...new Set([...dismissed, id])];
    localStorage.setItem('offerLensDismissedNotifs', JSON.stringify(updatedDismissed));
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllNotifications = () => {
    const currentIds = notifications.map((n) => n.id);
    const dismissed = JSON.parse(localStorage.getItem('offerLensDismissedNotifs') || '[]');
    const updatedDismissed = [...new Set([...dismissed, ...currentIds])];
    localStorage.setItem('offerLensDismissedNotifs', JSON.stringify(updatedDismissed));
    setNotifications([]);
  };

  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then(res => res.json())
      .then(data => {
        setKpiData(data);
      })
      .catch(err => console.error("Error fetching KPIs:", err));
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
  }, [theme]);

  useEffect(() => {
    syncNotifications();
  }, [activePage]);

  const navigationItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'New Investigation', icon: Search },
    { label: 'Threat Intelligence', icon: ShieldAlert },
    { label: 'Investigation History', icon: History },
    { label: 'Risk Analysis', icon: Activity },
    { label: 'Fraud Alerts', icon: Lock },
  ];

  const renderPage = () => {
    if (activePage === 'Dashboard') {
      return (
        <>
          <section className="stats">
            <div className="stat-card stat-1">
              <div className="stat-top">
                <Search size={20} />
                <span>+12.8%</span>
              </div>
              <p>Total Investigations</p>
              <h2>{kpiData.total_scans.toLocaleString()}</h2>
            </div>

            <div className="stat-card stat-2">
              <div className="stat-top">
                <ShieldAlert size={20} />
                <span>+8.4%</span>
              </div>
              <p>Threats Detected</p>
              <h2>{kpiData.high_risk_detected.toLocaleString()}</h2>
            </div>

            <div className="stat-card stat-3">
              <div className="stat-top">
                <Globe size={20} />
                <span>+4.2%</span>
              </div>
              <p>Suspicious Websites</p>
              <h2>{kpiData.phishing_urls.toLocaleString()}</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <ShieldCheck size={20} />
                <span>+15.2%</span>
              </div>
              <p>Active Alerts</p>
              <h2>{kpiData.active_alerts.toLocaleString()}</h2>
            </div>
          </section>

          <section className="middle-grid">
            <div className="panel">
              <div className="panel-title">
                <div>
                  <h3>Threat Distribution</h3>
                  <p>By severity level</p>
                </div>
              </div>

              <div className="donut-layout">
                <div
                  className="donut"
                  style={{
                    background:
                      'conic-gradient(#ef4055 0% 45%, #22C55E 45% 80%, #3B82F6 80% 100%)',
                  }}
                >
                  <div className="donut-center">
                    <h3>{kpiData.total_scans.toLocaleString()}</h3>
                    <span>Total Scans</span>
                  </div>
                </div>

                <div className="legend">
                  <div>
                    <span>
                      <i style={{ background: '#ef4055' }} />
                      High Risk
                    </span>
                    <strong>45%</strong>
                  </div>

                  <div>
                    <span>
                      <i style={{ background: '#22C55E' }} />
                      Medium Risk
                    </span>
                    <strong>35%</strong>
                  </div>

                  <div>
                    <span>
                      <i style={{ background: '#3B82F6' }} />
                      Low Risk
                    </span>
                    <strong>20%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">
                <div>
                  <h3>Investigation Activity</h3>
                  <p>Open vs analyzed investigations</p>
                </div>
                <span className="period">Last 7 days</span>
              </div>

              <svg
                viewBox="0 0 500 220"
                className="activity-chart"
                preserveAspectRatio="none"
              >
                {[40, 85, 130, 175].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="485"
                    y2={y}
                    stroke="#353047"
                    strokeDasharray="4 4"
                  />
                ))}

                <path
                  d="M40 165 C85 125 100 95 145 125 S205 150 245 85 S310 115 350 95 S405 10 440 25 S470 30 485 38 L485 200 L40 200 Z"
                  fill="url(#chartGradient)"
                />

                <path
                  d="M40 165 C85 125 100 95 145 125 S205 150 245 85 S310 115 350 95 S405 10 440 25 S470 30 485 38"
                  fill="none"
                  stroke="#985bff"
                  strokeWidth="3"
                />

                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#985bff"
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor="#985bff"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                  (day, i) => (
                    <text
                      key={day}
                      x={40 + i * 74}
                      y="216"
                      fill="#85809d"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {day}
                    </text>
                  )
                )}
              </svg>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel table-panel">
              <div className="panel-title">
                <div>
                  <h3>Recent Investigations</h3>
                  <p>Latest analysed opportunities and threats</p>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>INVESTIGATION</th>
                      <th>TYPE</th>
                      <th>RISK SCORE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Job Offer Verification</td>
                      <td>Recruitment</td>
                      <td>85/100</td>
                      <td>
                        <span className="risk high">High Risk</span>
                      </td>
                    </tr>

                    <tr>
                      <td>Internship Advertisement</td>
                      <td>Internship</td>
                      <td>52/100</td>
                      <td>
                        <span className="risk medium">Medium</span>
                      </td>
                    </tr>

                    <tr>
                      <td>Company Website</td>
                      <td>Website</td>
                      <td>12/100</td>
                      <td>
                        <span className="risk low">Low Risk</span>
                      </td>
                    </tr>

                    <tr>
                      <td>Suspicious Email</td>
                      <td>Phishing</td>
                      <td>92/100</td>
                      <td>
                        <span className="risk high">High Risk</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">
                <div>
                  <h3>Risk Overview</h3>
                  <p>Overall investigation distribution</p>
                </div>
              </div>

              <div className="risk-chart-layout">
                <div className="risk-legend">
                  <div>
                    <i style={{ background: '#ef4055' }} />
                    High Risk
                  </div>

                  <div>
                    <i style={{ background: '#a34bf0' }} />
                    Medium Risk
                  </div>

                  <div>
                    <i style={{ background: '#3979f5' }} />
                    Low Risk
                  </div>
                </div>

                <div
                  className="risk-donut"
                  style={{
                    background:
                      'conic-gradient(#ef4055 0% 35%, #a34bf0 35% 75%, #3979f5 75% 100%)',
                    borderRadius: '50%',
                  }}
                >
                  <div className="risk-center">
                    <h3>{kpiData.total_scans.toLocaleString()}</h3>
                    <span>Total Scans</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer>
            <span>© 2026 OfferLens AI</span>
            <span>Digital Fraud Intelligence &amp; Verification</span>
          </footer>
        </>
      );
    }

    if (activePage === 'New Investigation') return <NewInvestigation />;
    if (activePage === 'Threat Intelligence') return <ThreatIntelligence />;
    if (activePage === 'Investigation History') return <InvestigationHistory />;
    if (activePage === 'Risk Analysis') return <RiskAnalysis />;
    if (activePage === 'Fraud Alerts') return <FraudAlerts />;
    if (activePage === 'Settings') return <SettingsPage theme={theme} setTheme={setTheme} />;

    return (
      <div className="panel" style={{ padding: '28px', marginTop: '8px' }}>
        <h3>{activePage}</h3>
        <p style={{ color: '#9690ad', marginTop: '10px' }}>This section is coming soon.</p>
      </div>
    );
  };

  // If not logged in, render the landing page instead of the dashboard
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h2>OfferLens</h2>
            <span>AI INTELLIGENCE</span>
          </div>
        </div>

        <div className="user-box">
          <div className="user-avatar">OL</div>

          <div>
            <h4>Workspace</h4>
            <p>Security Analyst</p>
          </div>
        </div>

        <p className="menu-heading">WORKSPACE</p>

        <nav>
          {navigationItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={`menu-item ${
                activePage === label ? 'selected' : ''
              }`}
              onClick={() => setActivePage(label)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className={`menu-item ${
              activePage === 'Settings' ? 'selected' : ''
            }`}
            onClick={() => setActivePage('Settings')}
          >
            <Settings size={17} />
            Settings
          </button>

          <div className="plan-card">
            <ShieldCheck size={22} />
            <h4>Stay Protected</h4>
            <p>AI-powered digital safety for everyone.</p>
            <span>OFFERLENS AI</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-title">
            <h3>{activePage}</h3>
            <span>Overview / Security Intelligence</span>
          </div>

          <div className="header-actions">
            <div className="system-status">
              <span />
              System Active
            </div>

            {/* NOTIFICATION CENTER */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="notification" 
                aria-label="Notifications" 
                onClick={() => {
                  syncNotifications();
                  setShowNotifs(!showNotifs);
                }}
              >
                <Bell size={19} />
                {notifications.length > 0 && (
                  <span className="notif-badge">{notifications.length}</span>
                )}
              </button>
              
              {showNotifs && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <div>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>Notifications</h4>
                      <span style={{ fontSize: '11px', color: '#85809d' }}>{notifications.length} Active</span>
                    </div>

                    {notifications.length > 0 && (
                      <button 
                        type="button"
                        className="notif-clear-all-btn"
                        onClick={handleClearAllNotifications}
                        title="Clear all notifications"
                      >
                        <Trash2 size={14} />
                        <span>Clear all</span>
                      </button>
                    )}
                  </div>

                  <div className="notif-scroll-container">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="notif-item">
                          <div className={`notif-dot ${n.type}`}></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p>{n.text}</p>
                            <span className="notif-time">{n.time}</span>
                          </div>
                          <button
                            type="button"
                            className="notif-delete-single-btn"
                            onClick={() => handleDismissNotification(n.id)}
                            title="Dismiss notification"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="notif-empty">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="header-avatar">OL</div>
          </div>
        </header>

        <div className="content">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;