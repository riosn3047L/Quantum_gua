# 2. System Requirements

## 2.1 Hardware Specifications
To ensure stable execution during concurrent cryptographic scanning and AI processing, the following hardware specifications are recommended:

| Component | Minimum | Recommended (Enterprise Evaluation) |
| :--- | :--- | :--- |
| **CPU** | 2 vCPUs (2.0 GHz) | 4+ vCPUs |
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 20 GB SSD | 50 GB NVMe SSD |
| **Network** | Broadband internet (10 Mbps+) | Gigabit Ethernet connection |

*Note: The RAM requirement accounts for the V8 JavaScript engine overhead, concurrent TLS thread evaluations, and API buffering.*

## 2.2 Software & Operating System Specifications

| Component | Requirement |
| :--- | :--- |
| **Operating System** | Ubuntu 24.04 LTS or Windows Server 2022 |
| **Core Runtime** | Node.js (v18.x LTS or higher) |
| **Package Manager** | npm (v9+), yarn, or pnpm |
| **External Software** | Python 3.10+ (if utilizing legacy crypto analysis scripts), OpenSSL |

## 2.3 Client-Side Requirements (End User)
For optimal performance on the client-side dashboard:
- **Browser**: Modern web browser (Google Chrome 100+, Microsoft Edge 100+, Mozilla Firefox 100+, Safari 15+).
- **Features Required**:
  - JavaScript ES6+ execution.
  - `localStorage` API for state persistence.
  - Fetch API for backend communication.
