# QuantumGuard — Minimum Hardware & Software Requirements

> **Project**: QuantumGuard – Quantum Readiness Assurance Maturity Model (QRAMM)  
> **Version**: 1.0  
> **Date**: June 2026  
> **Team**: IravoVoid

---

## 1. End User Requirements (Frontend Only)

The QuantumGuard frontend is a static web application that runs entirely in the browser. These are the minimum requirements for end users performing assessments.

### 1.1 Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **Processor** | Dual-core 1.6 GHz (Intel i3 / AMD Ryzen 3 or equivalent) | Quad-core 2.0+ GHz (Intel i5 / AMD Ryzen 5 or equivalent) |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 100 MB free disk space (for browser cache) | 500 MB free disk space |
| **Display** | 1280 × 720 (HD) | 1920 × 1080 (Full HD) |
| **Network** | Broadband internet (1 Mbps+) | Broadband internet (5 Mbps+) |

### 1.2 Software Requirements

| Component | Minimum Version | Notes |
|---|---|---|
| **Operating System** | Windows 10, macOS 11 (Big Sur), Ubuntu 20.04, or equivalent | Any OS that supports a modern browser |
| **Web Browser** | Google Chrome 100+, Mozilla Firefox 100+, Microsoft Edge 100+, Safari 15+ | Chromium-based browsers recommended |
| **JavaScript** | Enabled (required) | All scoring logic runs client-side |
| **Cookies/Storage** | localStorage enabled | Required for saving assessment progress |

### 1.3 Browser Feature Requirements

| Feature | Required | Purpose |
|---|---|---|
| JavaScript ES6+ | ✅ Yes | Core application logic |
| localStorage API | ✅ Yes | Assessment data persistence |
| Fetch API | ✅ Yes | TLS scanner & backend communication |
| CSS Grid & Flexbox | ✅ Yes | Layout rendering |
| CSS Custom Properties | ✅ Yes | Design system theming |
| File API | ✅ Yes | Source code upload for scanner |
| Blob API | ✅ Yes | CBOM/report JSON export |
| WebFonts | ⚠️ Recommended | Typography (Inter, Space Grotesk, JetBrains Mono) |

---

## 2. Development Environment Requirements

Requirements for developers contributing to or modifying QuantumGuard.

### 2.1 Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **Processor** | Quad-core 2.0 GHz | 6+ core 2.5+ GHz |
| **RAM** | 8 GB | 16 GB |
| **Storage** | 2 GB free disk space | 5 GB free disk space |
| **Display** | 1920 × 1080 | 2560 × 1440 or dual monitors |
| **Network** | Broadband internet (5 Mbps+) | Broadband internet (10 Mbps+) |

### 2.2 Software Requirements

| Component | Version | Purpose |
|---|---|---|
| **Git** | 2.30+ | Version control |
| **Node.js** | 18.x LTS or later | Development server (`http-server`) |
| **npm** | 9.x+ | Package management |
| **Code Editor** | VS Code (recommended), or any text editor | Development |
| **Web Browser** | Chrome/Edge with DevTools | Testing and debugging |

### 2.3 Frontend Development

```bash
# Install development server
npm install -g http-server

# Start local server
cd implementation/frontend
http-server -p 8080 -c-1

# Access at http://localhost:8080
```

No build step, no bundler, no framework CLI required. The frontend is pure HTML/CSS/JS.

---

## 3. Backend Server Requirements

Requirements for deploying the Python Flask backend (required for deep TLS scanning and AI chat features).

### 3.1 Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **Processor** | Dual-core 2.0 GHz | Quad-core 2.5+ GHz |
| **RAM** | 2 GB | 4 GB |
| **Storage** | 1 GB free disk space | 2 GB free disk space |
| **Network** | Broadband internet (5 Mbps+) | Broadband internet (10 Mbps+) |
| **Network Ports** | Port 5000 (Flask API) | Configurable |

> **Note**: TLS scanning with SSLyze is CPU-intensive and may require more resources when scanning multiple subdomains concurrently.

### 3.2 Software Requirements

| Component | Version | Purpose |
|---|---|---|
| **Python** | 3.10+ | Runtime for backend services |
| **pip** | 22.0+ | Python package management |
| **virtualenv** | (recommended) | Isolated Python environment |

### 3.3 Python Dependencies

| Package | Version | Purpose |
|---|---|---|
| `flask` | ≥ 3.0.0 | REST API framework |
| `flask-cors` | ≥ 4.0.0 | Cross-origin resource sharing |
| `sslyze` | ≥ 6.0.0 | TLS/SSL scanning engine |
| `requests` | ≥ 2.31.0 | HTTP client (Gemini API calls) |
| `functions-framework` | ≥ 3.8.0 | Google Cloud Functions compatibility |
| `firebase-admin` | ≥ 6.4.0 | Firebase integration (optional) |
| `google-cloud-firestore` | ≥ 2.14.0 | Firestore integration (optional) |

### 3.4 Backend Setup

```bash
# Navigate to backend directory
cd implementation/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python tls_api_server.py
# Server runs at http://localhost:5000
```

### 3.5 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI chat) | Google Gemini API key for chat advisor |
| `FLASK_ENV` | No | Set to `production` for production deployment |
| `PORT` | No | Override default port 5000 |

---

## 4. Deployment Requirements

### 4.1 Vercel (Frontend)

| Requirement | Details |
|---|---|
| **Vercel Account** | Free tier sufficient |
| **Git Repository** | Connected GitHub/GitLab/Bitbucket repository |
| **Configuration** | `vercel.json` included in project root |
| **Output Directory** | `implementation/frontend` |
| **Build Command** | None (static site, no build step) |

### 4.2 Docker (Backend)

| Requirement | Details |
|---|---|
| **Docker Engine** | 20.10+ |
| **Docker Compose** | 2.0+ (optional) |
| **Container Resources** | Min 512 MB RAM, 0.5 CPU |

```bash
# Build and run with Docker
cd implementation/backend
docker build -t quantumguard-backend .
docker run -p 5000:5000 -e GEMINI_API_KEY=your_key quantumguard-backend
```

### 4.3 Google Cloud Run (Backend — Alternative)

| Requirement | Details |
|---|---|
| **Google Cloud Account** | With billing enabled |
| **gcloud CLI** | Installed and authenticated |
| **Cloud Run** | Enabled in project |
| **Container Registry** | Artifact Registry or Container Registry |

```bash
# Deploy to Cloud Run
gcloud run deploy quantumguard-api \
  --source implementation/backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

---

## 5. Network Requirements

### 5.1 Frontend (End User)

| Direction | Destination | Port | Protocol | Purpose |
|---|---|---|---|---|
| Outbound | Vercel CDN | 443 | HTTPS | Application loading |
| Outbound | cdn.tailwindcss.com | 443 | HTTPS | Tailwind CSS framework |
| Outbound | fonts.googleapis.com | 443 | HTTPS | Google Fonts |
| Outbound | fonts.gstatic.com | 443 | HTTPS | Font files |
| Outbound | cdnjs.cloudflare.com | 443 | HTTPS | html2pdf.js library |
| Outbound | Backend API | 5000 | HTTP/S | TLS scanning (optional) |

### 5.2 Backend Server

| Direction | Destination | Port | Protocol | Purpose |
|---|---|---|---|---|
| Inbound | Clients | 5000 | HTTP | API requests |
| Outbound | Target hosts | 443 | TLS | SSLyze TLS scanning |
| Outbound | generativelanguage.googleapis.com | 443 | HTTPS | Gemini AI API |
| Outbound | DNS servers | 53 | DNS | Subdomain discovery |

### 5.3 Firewall Rules

- **Frontend only**: No special firewall rules needed (standard HTTPS outbound)
- **Backend**: Requires outbound access to port 443 on arbitrary hosts (for TLS scanning)
- **Backend**: Requires outbound DNS queries (for subdomain discovery)

---

## 6. Compatibility Matrix

### 6.1 Browser Compatibility

| Browser | Minimum Version | Status |
|---|---|---|
| Google Chrome | 100+ | ✅ Fully Supported |
| Microsoft Edge | 100+ | ✅ Fully Supported |
| Mozilla Firefox | 100+ | ✅ Fully Supported |
| Safari | 15+ | ✅ Supported |
| Opera | 86+ | ✅ Supported |
| Internet Explorer | Any | ❌ Not Supported |

### 6.2 Operating System Compatibility

| OS | Frontend (Browser) | Backend (Python) |
|---|---|---|
| Windows 10/11 | ✅ | ✅ |
| macOS 11+ (Big Sur+) | ✅ | ✅ |
| Ubuntu 20.04+ | ✅ | ✅ |
| Debian 11+ | ✅ | ✅ |
| CentOS/RHEL 8+ | ✅ | ✅ |
| Fedora 35+ | ✅ | ✅ |

### 6.3 Mobile Device Support

| Device | Status | Notes |
|---|---|---|
| iOS (Safari 15+) | ⚠️ Partial | Assessment works; scanner file upload limited |
| Android (Chrome 100+) | ⚠️ Partial | Assessment works; scanner file upload limited |
| Tablets | ✅ Supported | Full functionality on tablet-sized screens |

---

## 7. Performance Benchmarks

| Operation | Expected Duration | Resource Impact |
|---|---|---|
| Page load (initial) | < 2 seconds | Low (static assets, CDN-cached) |
| Quick assessment completion | 5–10 minutes | Minimal (localStorage writes) |
| Comprehensive assessment | 30–60 minutes | Minimal (localStorage writes) |
| CryptoScan (single file) | < 1 second | Low CPU |
| CryptoScan (10 files) | < 5 seconds | Moderate CPU |
| TLS scan (single host, backend) | 10–30 seconds | High CPU (SSLyze) |
| TLS scan with subdomains | 30–120 seconds | High CPU |
| CBOM export (JSON) | < 1 second | Minimal |
| Results page rendering | < 1 second | Low CPU |

---

## 8. Summary — Quick Reference

| Use Case | Minimum Hardware | Key Software |
|---|---|---|
| **End User (Assessment)** | Any modern device with a browser | Chrome/Firefox/Edge 100+ |
| **End User (Scanner)** | Desktop/laptop recommended | Chrome/Firefox/Edge 100+ |
| **Developer** | 8 GB RAM, quad-core CPU | Git, Node.js 18+, VS Code |
| **Backend Deployment** | 2 GB RAM, dual-core CPU | Python 3.10+, Docker 20.10+ |
| **Full Stack** | 8 GB RAM, quad-core CPU | All of the above |
