# 1. System Architecture

## 1.1 Overview
QuantumGuard is architected as a highly modular, decoupled 3-Tier Enterprise application. It is specifically designed to provide high scalability, maintainability, and security for assessing post-quantum cryptography (PQC) readiness. The system evaluates cryptographic posture across application code, network endpoints, and dependencies, leveraging AI for actionable insights.

## 1.2 The 3-Tier Architecture

### 1.2.1 Presentation Tier (Client)
- **Frameworks & Libraries**: HTML5, CSS3, Vanilla JavaScript (ES6+), Tailwind CSS.
- **Role**: Delivers the user interface, manages client-side validations, renders compliance dashboards, and visualizes CBOMs.
- **State Management**: Utilizes `localStorage` for stateless session persistence to ensure maximum client privacy. No sensitive data is stored on external servers without explicit consent.

### 1.2.2 Application Tier (Server)
- **Frameworks & Libraries**: Node.js, Express.js.
- **Role**: Operates as the central API gateway and processing engine. 
- **Capabilities**:
  - **TLS Scanner Service**: Evaluates external domains for cryptographic readiness, analyzing cipher suites and TLS protocol versions.
  - **AI Proxy Service**: Securely integrates with the Google Gemini API to power the AI Chat Advisor, ensuring API keys are not exposed to the client.
  - **CBOM Engine**: Generates Cryptographic Bill of Materials based on scanner outputs.

### 1.2.3 Data Tier (Storage)
- **Role**: Manages historical scan reports, schema definitions, and persistent logs.
- **Technologies**: 
  - File System storage (JSON formats)
  - Firebase Hosting & Firestore (Optional/Enterprise Extension for distributed multi-tenant environments).

## 1.3 Data Flow
1. **User Interaction**: User initiates a scan or assessment via the Presentation Tier.
2. **API Request**: The Presentation Tier sends an HTTP/HTTPS request to the Application Tier.
3. **Processing**: The Express.js backend executes the appropriate business logic (e.g., querying external domains for TLS handshakes, or querying Gemini for AI advice).
4. **Response**: The Application Tier structures the response (e.g., CBOM JSON) and returns it to the client for rendering via Chart.js or Tailwind UI components.
