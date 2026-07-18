# 6. Development & Feature Roadmap

## 6.1 Phase 1: MVP & Core Scanners (Current)
- Complete Client-Side Assessment Engine (Quick & Comprehensive).
- Implement TLS Subdomain Scanning.
- Integrate AI Chat Advisor (Gemini API).
- Exportable CBOMs (JSON/PDF).

## 6.2 Phase 2: Enterprise State Management & Authentication
- **Database Integration**: Transition from `localStorage` to a scalable relational database (PostgreSQL) or NoSQL (Firestore) for enterprise multi-tenant support.
- **Role-Based Access Control (RBAC)**: Support for Admin, Assessor, and Viewer roles.
- **Team Collaboration**: Shared organizational profiles and historical trend tracking across multiple team members.

## 6.3 Phase 3: Advanced Automation & AST Parsing
- **AST Source Analysis**: Replace rudimentary regex source code scanning with Abstract Syntax Tree (AST) parsing for highly accurate algorithm detection.
- **CI/CD Integration**: Provide GitHub Actions and GitLab CI runners to block pull requests containing vulnerable legacy cryptographic primitives.
- **Automated Remediation**: AI-powered pull request generation to automatically upgrade vulnerable code blocks to PQC-compliant equivalents.

## 6.4 Phase 4: Compliance Expansion
- Expand mapping engine beyond NIST PQC and FedRAMP to include ISO/IEC 27001:2022, GDPR, and NSM 10.
