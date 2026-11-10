import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Save, CheckCircle2, Mail } from 'lucide-react';
import './Settings.css';

function SettingsPage({ theme, setTheme }) {
  const [saveStatus, setSaveStatus] = useState('');
  
  // 1. Make Profile Editable & Linked to LocalStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('offerLensProfile');
    return saved ? JSON.parse(saved) : { name: 'Security Analyst', email: 'analyst@offerlens.ai' };
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('offerLensSettings');
    return saved ? JSON.parse(saved) : { criticalAlerts: true, highRisk: true, emailNotifs: false, weeklySummary: false, twoFactor: false };
  });

  const [tempTheme, setTempTheme] = useState(theme);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
    localStorage.setItem('offerLensProfile', JSON.stringify(profile));
    localStorage.setItem('offerLensSettings', JSON.stringify(preferences));
    setTheme(tempTheme);
    localStorage.setItem('offerLensTheme', tempTheme);

    if (preferences.emailNotifs && profile.email) {
      setSaveStatus('Sending alert to backend...');
      
      try {
        const response = await fetch('/api/settings/test-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile.email })
        });
        
        const data = await response.json();
        
        // Check if the backend aborted due to missing .env variables
        if (data.status === 'mock_success') {
          setSaveStatus('⚠️ Backend Error: SENDER_EMAIL or SENDER_PASSWORD missing in .env');
        } 
        else if (response.ok) {
          setSaveStatus(`Changes saved! Test alert sent to ${profile.email}`);
        } 
        else {
          setSaveStatus(`⚠️ Failed: ${data.detail || 'Check backend terminal'}`);
        }
      } catch (error) {
        console.error("Email error:", error);
        setSaveStatus('⚠️ Changes saved! (Backend disconnected)');
      }
    } else {
      setSaveStatus('Changes saved successfully!');
    }
    
    setTimeout(() => setSaveStatus(''), 5000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ color: '#985bff', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>ACCOUNT MANAGEMENT</span>
        <h1 style={{ marginTop: '10px' }}>Settings</h1>
        <p style={{ color: '#85809d' }}>Manage your profile, security and application preferences.</p>
      </div>

      <section className="settings-section panel">
        <div className="settings-section-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderBottom: '1px solid #2d2a3d' }}>
          <div style={{ background: '#353047', padding: '10px', borderRadius: '8px' }}><User size={20} /></div>
          <div>
            <h3 style={{ margin: 0 }}>Profile Information</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#85809d' }}>Manage your personal account details.</p>
          </div>
        </div>
        
        <div style={{ padding: '25px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#85809d' }}>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profile.name} 
                onChange={handleProfileChange}
                style={{ width: '100%', padding: '12px', background: '#252331', border: '1px solid #353047', borderRadius: '6px', color: '#fff', outline: 'none' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#85809d' }}>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={profile.email} 
                onChange={handleProfileChange}
                style={{ width: '100%', padding: '12px', background: '#252331', border: '1px solid #353047', borderRadius: '6px', color: '#fff', outline: 'none' }} 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section panel" style={{ marginTop: '20px' }}>
        <div className="settings-section-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderBottom: '1px solid #2d2a3d' }}>
          <div style={{ background: '#b4530930', color: '#f59e0b', padding: '10px', borderRadius: '8px' }}><Bell size={20} /></div>
          <div>
            <h3 style={{ margin: 0 }}>Notification Preferences</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#85809d' }}>Choose which security notifications you receive.</p>
          </div>
        </div>

        <div className="toggle-list" style={{ padding: '10px 25px' }}>
          {[
            { id: 'criticalAlerts', title: 'Critical Risk Alerts', desc: 'Receive alerts for critical security threats.' },
            { id: 'highRisk', title: 'High Risk Notifications', desc: 'Get notified about high-risk activities.' },
            { id: 'emailNotifs', title: 'Email Notifications', desc: 'Receive security updates through email.' },
            { id: 'weeklySummary', title: 'Weekly Security Summary', desc: 'Receive a weekly overview of investigations.' }
          ].map((item, index) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: index < 3 ? '1px solid #2d2a3d' : 'none' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{item.title}</h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#85809d' }}>{item.desc}</p>
              </div>
              <div 
                className={`toggle-switch ${preferences[item.id] ? 'active' : ''}`}
                onClick={() => handleToggle(item.id)}
                style={{ width: '44px', height: '24px', background: preferences[item.id] ? '#985bff' : '#353047', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              >
                <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: preferences[item.id] ? '23px' : '3px', transition: '0.3s' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section panel" style={{ marginTop: '20px' }}>
        <div className="settings-section-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderBottom: '1px solid #2d2a3d' }}>
          <div style={{ background: '#05966930', color: '#10b981', padding: '10px', borderRadius: '8px' }}><Shield size={20} /></div>
          <div>
            <h3 style={{ margin: 0 }}>Security Settings</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#85809d' }}>Manage your account security preferences.</p>
          </div>
        </div>

        <div style={{ padding: '10px 25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px' }}>Two-Factor Authentication</h4>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#85809d' }}>Additional account protection.</p>
            </div>
            <div 
                className={`toggle-switch ${preferences.twoFactor ? 'active' : ''}`}
                onClick={() => handleToggle('twoFactor')}
                style={{ width: '44px', height: '24px', background: preferences.twoFactor ? '#985bff' : '#353047', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              >
                <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: preferences.twoFactor ? '23px' : '3px', transition: '0.3s' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section panel" style={{ marginTop: '20px' }}>
        <div className="settings-section-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderBottom: '1px solid #2d2a3d' }}>
          <div style={{ background: '#2563eb30', color: '#3b82f6', padding: '10px', borderRadius: '8px' }}><Palette size={20} /></div>
          <div>
            <h3 style={{ margin: 0 }}>Application Preferences</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#85809d' }}>Customize your application experience.</p>
          </div>
        </div>

        <div style={{ padding: '25px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '300px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#85809d', textAlign: 'center' }}>Theme</label>
            <select 
              value={tempTheme} 
              onChange={(e) => setTempTheme(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#252331', border: '1px solid #353047', borderRadius: '6px', color: '#fff', outline: 'none' }}
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginTop: '30px', paddingBottom: '30px' }}>
        {saveStatus && <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
          {saveStatus.includes('Test alert') ? <Mail size={16} /> : <CheckCircle2 size={16} />} {saveStatus}
        </span>}
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#985bff', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;