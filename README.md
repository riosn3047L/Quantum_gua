# QuantumGuard
A platform for quantum readiness assurance, vulnerability scanning, and compliance maturity.

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ 3-Tier Architecture](#️-3-tier-architecture)
- [🛠️ Recommended Specifications](#️-recommended-specifications)
- [🚀 Getting Started (Local Setup)](#-getting-started-local-setup)
- [🧠 Scoring Methodology](#-scoring-methodology)
- [📁 Repository Structure](#-repository-structure)
- [🛡️ Security & Privacy](#️-security--privacy)

## ✨ Key Features
1. **Maturity Assessment Engine**: Quick (12 questions) and Comprehensive (120 questions) assessments.
2. **Quantum Cryptography Scanners**: TLS Scanner, CryptoScan, and CryptoDeps for vulnerability analysis.
3. **CBOM Generator**: Generate Cryptographic Bills of Materials.
4. **Results & Compliance Dashboard**: NIST PQC, CMMC 2.0, FedRAMP, and FISMA mappings.
5. **AI Chat Advisor**: Integrated Gemini AI for cybersecurity advice.

## 🏗️ 3-Tier Architecture
QuantumGuard is designed with a modern, decoupled 3-Tier Architecture to ensure scalability and security for enterprise and banking environments.

```text
┌─────────────────────────────────────────────────────────┐
│                    3-Tier Architecture                  │
│                                                         │
│  [ Presentation Tier ]  -- Client-side UI               │
│  HTML5, Tailwind CSS, Vanilla JS. Runs in the browser.  │
│                                                         │
│          ↕ HTTP Requests                                │
│                                                         │
│  [ Application Tier ]   -- Node.js & Express.js         │
│  Handles business logic, TLS scanning, Gemini AI proxy. │
│                                                         │
│          ↕ Data Read/Write                              │
│                                                         │
│  [ Data Tier ]          -- Storage & Persistence        │
│  localStorage (Client), File System (Server),           │
│  Optional Firebase DB.                                  │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Recommended Specifications
For the PNB Evaluation, the following specifications present a stable, enterprise-ready environment:

- **CPU**: Minimum 2 vCPUs (2.0 GHz or higher) to handle concurrent scanning threads without locking up.
- **RAM**: 4 GB (provides a safe buffer for the V8 JavaScript engine, the AI chatbot, and the scanning tools).
- **Storage**: 20 GB SSD (ensures plenty of headroom for OS dependencies, `node_modules`, and historical scan reports).
- **Operating System**: Ubuntu 24.04 LTS or Windows Server.
- **Dependencies**: 
  - Node.js (v18+)
  - Package Manager: `npm`, `yarn`, or `pnpm`
  - Python 3.10+ (if legacy crypto analysis is utilized)

## 🚀 Getting Started (Local Setup)
QuantumGuard is a full-stack Node.js application.

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

## 📁 Repository Structure
```text
QuantumGuard/
├── public/                # Vanilla JS + Tailwind HTML App
│   ├── index.html         # Landing page
│   ├── tools.html         # Scanners
│   └── ...
├── src/                   # Node.js Backend API
│   ├── server.js          # Express app
│   ├── scanner.js         # TLS Scanning logic
│   └── ...
├── docs/        # Documentation
├── package.json
└── README.md
```

## 🛡️ Security & Privacy
* **Client-Side Data**: Assessments are stored in `localStorage`.
* **API Endpoints**: TLS Scanners and Gemini AI routes proxy via the Node.js backend.
