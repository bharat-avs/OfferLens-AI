# 🛡️ OfferLens AI — Digital Fraud Intelligence & Offer Verification

[![Hackathon](https://img.shields.io/badge/BharatCode-2026-8b5cf6.svg)](https://github.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **OfferLens AI** is an autonomous threat intelligence and fraud verification platform designed to detect fraudulent employment offers, phishing domains, and recruitment scams using real-time content analysis, risk scoring, and automated threat notifications.

---

## 🌟 Key Features

- **Autonomous Offer Verification:** Scans offer letters, recruitment emails, and URLs against threat heuristics to calculate real-time fraud risk scores.
- **Dynamic Threat Intelligence Dashboard:** Interactive SOC metrics, severity distribution, and weekly activity monitoring.
- **Real-Time Fraud Alerts & SOC Triage:** Synchronized alert database with live status toggling (`New`, `Investigating`, `Resolved`) and notification management.
- **Automated Incident Dispatch:** Real-time email dispatch alerting users and security analysts when high-risk or critical threats are detected.
- **Role-Based Authentication Gateway:** Secure glassmorphic landing experience protecting the workspace environment.

---

## 📸 System Showcase

### 1. Authentication & Security Gateway
*Secure access portal featuring modern glassmorphism and integrated security controls.*

![OfferLens Login](frontend/public/logo.png)

### 2. Security Operations Dashboard
*Live KPI tracking, severity distribution donuts, and recent investigations activity.*

---

## 🏗️ System Architecture & Tech Stack

```text
OfferLensAI/
├── BharatCode.txt           # Hackathon root verification record
├── backend/                 # FastAPI REST API & AI heuristics engine
│   ├── main.py              # Application core, routing, and scanner pipeline
│   ├── .env.example         # Template for environment credentials
│   └── requirements.txt     # Python dependencies
└── frontend/                # React.js application powered by Vite
    ├── src/
    │   ├── App.jsx          # Primary workspace layout & synced notifications
    │   ├── Login.jsx        # Security authentication gateway
    │   ├── FraudAlerts.jsx  # Synced SOC alert management system
    │   └── ...              # Threat intelligence & analytics modules
    └── package.json         # Node.js dependencies


🚀 Quick Start Guide
Prerequisites
    Node.js (v18.0 or higher)
    Python (v3.10 or higher)
    Git