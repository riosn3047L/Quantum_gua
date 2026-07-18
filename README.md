# QuantumGuard
A platform for quantum readiness assurance, vulnerability scanning, and compliance maturity.

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started (Local Setup)](#-getting-started-local-setup)
- [🧠 Scoring Methodology](#-scoring-methodology)
- [🏗️ Architecture](#️-architecture)
- [📁 Repository Structure](#-repository-structure)
- [🛡️ Security & Privacy](#️-security--privacy)

## ✨ Key Features
1. **Maturity Assessment Engine**: Quick (12 questions) and Comprehensive (120 questions) assessments.
2. **Quantum Cryptography Scanners**: TLS Scanner, CryptoScan, and CryptoDeps for vulnerability analysis.
3. **CBOM Generator**: Generate Cryptographic Bills of Materials.
4. **Results & Compliance Dashboard**: NIST PQC, CMMC 2.0, FedRAMP, and FISMA mappings.
5. **AI Chat Advisor**: Integrated Gemini AI for cybersecurity advice.

## 🛠️ Technology Stack
**Frontend**
* HTML5 / CSS3 / Vanilla JavaScript (ES6+)
* Tailwind CSS (via CDN)
* Client-side `localStorage` persistence

**Backend**
* Node.js & Express.js
* Google Gemini SDK (@google/genai)
* TLS node capabilities

**Deployment**
* Node.js Server (Port 3000)
* Firebase Hosting (Optional)

## 🚀 Getting Started (Local Setup)
QuantumGuard is a full-stack Node.js application.

### Prerequisites
* Node.js (v18+)
* npm or bun
* Google Gemini API Key

### Ubuntu 20.04 VM Support
Yes, QuantumGuard can absolutely run on an Ubuntu 20.04 VM. You just need to ensure Node.js is installed on your Ubuntu VM. You can install Node.js using NVM or NodeSource on Ubuntu 20.04.

### 1. Installation
```bash
# Clone the repository
# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:
```bash
GEMINI_API_KEY="your_api_key_here"
```

### 3. Run the Servers (Frontend & Backend)
The backend and frontend static server are combined in one Express.js application.

```bash
# Start the full-stack server
npm run start
```
The server will start on `http://localhost:3000`. This single command serves both the frontend web application (from the `public` directory) and the backend API (under `/api/*`).

## 🧠 Scoring Methodology
Evaluates readiness across **4 Dimensions**: CVI, SGRM, DPE, and ITR. Uses weakest-link principle mapping to a 5-level maturity tier.

## 🏗️ Architecture
```text
┌─────────────────────────────────────────────────────────┐
│                    Node.js & Express                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Frontend (public/)                  │   │
│  │  index.html │ assessment │ results │ compliance  │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │ HTTP                          │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │              Express Backend (src/server.js)     │   │
│  │  /api/health │ /api/tls-scan │ /api/chat         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Repository Structure
```text
QuantumGuard/
├── public/                # Vanilla JS + Tailwind HTML App
│   ├── index.html         # Landing page
│   ├── quick-assessment.html
│   ├── tools.html         # Scanners
│   └── ...
├── src/                   # Node.js Backend API
│   ├── server.js          # Express app
│   ├── scanner.js         # TLS Scanning logic
│   └── ...
├── knowledge_base/        # Documentation
├── package.json
└── README.md
```

## 🛡️ Security & Privacy
* **Client-Side Data**: Assessments are stored in `localStorage`.
* **API Endpoints**: TLS Scanners and Gemini AI routes proxy via the Node.js backend.
