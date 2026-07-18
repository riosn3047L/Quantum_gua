# 4. Security & Privacy Posture

## 4.1 Client-Side Data Sovereignty
To maximize privacy and encourage organizations to provide accurate data during self-assessments, QuantumGuard prioritizes client-side data sovereignty:
- **Zero-Transmission Assessments**: Assessment answers, organizational profiles, and generated scores are stored exclusively in the browser's `localStorage`. This data is *never* transmitted to the backend Application Tier unless explicitly authorized via an enterprise export feature.

## 4.2 Scanner Security
- **Source Code Scanners**: Operations like `CryptoScan` utilize browser-based regex analysis. Source code files uploaded to the scanner are processed in-memory within the V8 engine and do not leave the host machine.
- **TLS Scanners**: The backend TLS scanner interacts directly with external hostnames provided by the user. Rate limiting and timeout mechanisms are enforced on the backend to prevent abuse (e.g., SSRF or DoS).

## 4.3 API & Credential Security
- **Backend Proxying**: All integrations with external AI models (e.g., Google Gemini) are securely proxied through the Application Tier.
- **Environment Variables**: API keys (`GEMINI_API_KEY`) and sensitive configurations are injected via `.env` files and are excluded from version control.

## 4.4 Data Protection & Cryptography
While QuantumGuard is a tool to assess cryptography, it also adheres to modern TLS standards for its own transit security. Deployments are strongly recommended to be served over HTTPS, enforcing HSTS (HTTP Strict Transport Security).
