# 2. System Requirements

This document outlines the detailed hardware, software, and network prerequisites required to securely deploy, run, and access the QuantumGuard platform.

---

## 2.1 Hardware Specifications (Application & Data Tiers)
To ensure stable execution during concurrent cryptographic scanning (TLS handshakes) and real-time AI processing, the following hardware specifications are recommended for the server hosting the Node.js backend.

| Component | Minimum Requirement | Recommended (Enterprise / Production) | Justification |
| :--- | :--- | :--- | :--- |
| **CPU** | 2 vCPUs (2.0 GHz) | 4+ vCPUs (2.5 GHz+) | TLS scanning and concurrent API proxying require multi-threading capabilities. A minimum of 2 vCPUs ensures the V8 engine doesn't lock up during heavy cryptographic parsing. |
| **RAM** | 4 GB | 8 GB+ | Provides a safe memory buffer for the Node.js V8 engine heap, the AI chatbot proxy streaming, and memory-intensive external scanning tools. |
| **Storage** | 20 GB SSD | 50 GB NVMe SSD | Ensures sufficient IOPS and headroom for OS dependencies, `node_modules`, log files, and potential historical CBOM report generation. |
| **Network** | 10 Mbps Broadband | 1 Gigabit Ethernet | Fast, stable outbound connections are strictly required for the server to perform accurate, low-latency TLS scans against target infrastructure. |

---

## 2.2 Software & Operating System Specifications

### 2.2.1 Server Environment
The backend Application Tier is platform-agnostic but is officially supported and tested on the following environments:

| Component | Requirement | Version / Details |
| :--- | :--- | :--- |
| **Operating System** | Linux / Windows | **Ubuntu 24.04 LTS** (Recommended), Debian 12, or Windows Server 2022. |
| **Core Runtime** | Node.js | **v18.x LTS or v20.x LTS**. Required for Express.js and modern ES modules. |
| **Package Manager** | npm, yarn, or pnpm | **npm v9.x or higher** for dependency resolution. |
| **Process Manager** | pm2 (Optional but rec.) | Recommended for keeping the Node.js application running in the background and managing restarts on failure in production. |

### 2.2.2 Network & Port Configuration
Firewalls and Security Groups must be configured to allow the following traffic:

| Direction | Port | Protocol | Purpose |
| :--- | :--- | :--- | :--- |
| **Inbound** | `80` / `443` | HTTP(S) | Standard web traffic from end-users to the application (typically handled via a Reverse Proxy like Nginx). |
| **Inbound** | `3000` | HTTP | Default internal port for the Express.js server (should be closed to the public and proxied via Nginx). |
| **Outbound** | `443` | HTTPS | Required for the Application Tier to communicate with the Google Gemini API, and to perform TLS/SSL scans on target URLs. |

---

## 2.3 Client-Side Requirements (End User)
QuantumGuard is designed to be highly accessible. End users interacting with the Presentation Tier need only a modern web browser.

### 2.3.1 Supported Web Browsers
*   **Google Chrome**: Version 100 or higher
*   **Microsoft Edge**: Version 100 or higher
*   **Mozilla Firefox**: Version 100 or higher
*   **Apple Safari**: Version 15 or higher

### 2.3.2 Required Browser Capabilities
For the dashboard, assessment engine, and client-side scanners to function correctly, the user's browser MUST support and allow:
*   **JavaScript (ES6+)**: Must be enabled. The application cannot function without client-side scripts.
*   **`localStorage` API**: Strictly required. If the user is in "Strict Incognito" mode or has cookies/local data completely blocked, the Assessment Engine will fail to save progress.
*   **Fetch API / XHR**: Required for communicating with the backend API to generate CBOMs and receive AI advice.
*   **File API**: Required for the `CryptoScan` tool, allowing users to select local source code files for in-browser regex analysis without uploading them to the server.
