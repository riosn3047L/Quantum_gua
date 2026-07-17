# QuantumGuard — National-Grade Technical Upgrade Plan

> **Project**: QuantumGuard – Quantum Readiness Assurance Maturity Model (QRAMM)
> **Current State**: Hackathon MVP / Prototype
> **Target State**: National-Project-Grade Production Platform
> **Date**: April 2026

---

## Executive Summary

QuantumGuard currently operates as a **client-side hackathon prototype** with significant technical gaps that prevent it from being deployed as a credible, government-grade quantum readiness assessment platform. This document outlines **47 specific technical upgrades** across 8 engineering domains to elevate the project to national-project caliber — the kind of system CERT-In, NCIIPC, or a national cybersecurity agency would endorse.

The upgrades are categorized by **severity** (🔴 Critical, 🟡 High, 🟢 Medium) and **effort** (S/M/L/XL).

---

## Table of Contents

1. [Critical Bug Fixes (Ship-Blockers)](#1-critical-bug-fixes)
2. [Scoring Engine Hardening](#2-scoring-engine-hardening)
3. [Scanner Engine Technical Upgrades](#3-scanner-engine-technical-upgrades)
4. [Backend Architecture Overhaul](#4-backend-architecture-overhaul)
5. [Security Hardening](#5-security-hardening)
6. [Frontend Architecture Reform](#6-frontend-architecture-reform)
7. [Data Layer & Persistence](#7-data-layer--persistence)
8. [Compliance & Standards Expansion](#8-compliance--standards-expansion)
9. [Observability & Reliability](#9-observability--reliability)
10. [Implementation Priority Matrix](#10-implementation-priority-matrix)

---

## 1. Critical Bug Fixes

These are **ship-blocking defects** that make the current scoring engine produce incorrect results.

### 🔴 BUG-001: Practice ID Mismatch (data.js)

| Attribute | Detail |
|---|---|
| **File** | `implementation/frontend/data.js:692-1232` |
| **Severity** | 🔴 Critical — scoring is fundamentally broken |
| **Effort** | S (30 mins) |

**Problem**: All 60 questions for DPE (Dimension 3) and ITR (Dimension 4) are mapped to `practice: '2.3'` instead of their correct practice IDs (`3.1`, `3.2`, `3.3`, `4.1`, `4.2`, `4.3`).

**Impact**: 
- Practices 3.1–4.3 always return score **0**
- Practice 2.3 is inflated with questions from 3 different dimensions
- The comprehensive assessment is **unusable** — 50% of the scoring model is corrupted

**Fix**: Re-map questions 61–120 in 10-question blocks:
```diff
- { id: 61, dimension: 'DPE', practice: '2.3', ... }
+ { id: 61, dimension: 'DPE', practice: '3.1', ... }
// Questions 61-70 → practice '3.1'
// Questions 71-80 → practice '3.2'
// Questions 81-90 → practice '3.3'
// Questions 91-100 → practice '4.1'
// Questions 101-110 → practice '4.2'
// Questions 111-120 → practice '4.3'
```

---

### 🔴 BUG-002: Donut Chart Double-Count (results.html)

| Attribute | Detail |
|---|---|
| **File** | `implementation/frontend/results.html:300-302` |
| **Severity** | 🔴 Critical — chart data is mathematically incorrect |
| **Effort** | S (10 mins) |

**Problem**: Score `3` is counted in both "Established" AND "Advanced" buckets, making the donut chart percentages exceed 100%.

```diff
- else if (score === 3) { levelCounts.Established++; levelCounts.Advanced++; }
+ else if (score >= 2.5 && score < 3.5) { levelCounts.Established++; }
+ else if (score >= 3.5 && score < 4.0) { levelCounts.Advanced++; }
```

---

### 🔴 BUG-003: Auto-Advance on Navigation Back (quick-assessment.html)

| Attribute | Detail |
|---|---|
| **File** | `implementation/frontend/quick-assessment.html:254` |
| **Severity** | 🟡 High — users cannot review answers |
| **Effort** | S (15 mins) |

**Problem**: Navigating back to a previously answered question triggers the radio `change` event, which fires the 600ms auto-advance — the user is immediately pushed forward.

**Fix**: Add a `navigating` flag guard:
```javascript
let isNavigating = false;
function goTo(idx) {
  isNavigating = true;
  // ... render question ...
  setTimeout(() => { isNavigating = false; }, 700);
}
// In change handler:
if (!isNavigating) setTimeout(() => goNext(), 600);
```

---

### 🔴 BUG-004: Compliance Page Null Reference (compliance.html)

| Attribute | Detail |
|---|---|
| **File** | `implementation/frontend/compliance.html:174-175` |
| **Severity** | 🔴 Critical — page crashes with no data |
| **Effort** | S (10 mins) |

**Fix**:
```javascript
const compAnswers = Engine.getAnswers('comprehensive') || {};
const quickAnswers = Engine.getAnswers('quick') || {};
const answers = Object.keys(compAnswers).length > 0 ? compAnswers : quickAnswers;
const questions = Object.keys(compAnswers).length > 0 ? QG.QUESTIONS : QG.QUICK_QUESTIONS;
```

---

## 2. Scoring Engine Hardening

The scoring engine (`engine.js`) needs upgrades to be scientifically rigorous and defensible in a government assessment context.

### 🟡 SCORE-001: Apply Risk Multiplier to Final Score

**Current**: Risk multiplier (1.0–1.5) is calculated and displayed but **never used** in scoring.

**Upgrade**: Integrate risk multiplier into the scoring pipeline:
```javascript
Engine.getAdjustedScore = function(rawScore, profile) {
  const riskMultiplier = Engine.calculateRiskMultiplier(profile);
  // Higher risk → requires higher maturity → effectively lowers the adjusted score
  const adjustedScore = rawScore / riskMultiplier;
  return {
    rawScore,
    riskMultiplier,
    adjustedScore: parseFloat(adjustedScore.toFixed(2)),
    maturityLevel: Engine.getMaturityLevel(adjustedScore)
  };
};
```

### 🟡 SCORE-002: Weighted Dimension Scoring

**Current**: Overall score = simple average of 4 dimension scores.

**Upgrade**: Add configurable dimension weights so critical infrastructure orgs can weight "Data Protection Engineering" higher than "Strategic Governance":
```javascript
const DEFAULT_DIMENSION_WEIGHTS = {
  CVI: 0.25,   // Cryptographic Visibility & Inventory
  SGRM: 0.20,  // Strategic Governance & Risk Mgmt
  DPE: 0.30,   // Data Protection Engineering (most critical)
  ITR: 0.25    // Implementation & Technical Readiness
};

Engine.calculateWeightedOverallScore = function(answers, questions, weights = DEFAULT_DIMENSION_WEIGHTS) {
  let weightedSum = 0;
  let totalWeight = 0;
  Object.entries(weights).forEach(([dimId, weight]) => {
    const dimScore = Engine.calculateDimensionScore(answers, dimId, questions);
    if (dimScore > 0) {
      weightedSum += dimScore * weight;
      totalWeight += weight;
    }
  });
  return totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 0;
};
```

### 🔴 SCORE-003: Confidence Interval & Statistical Validity

**Upgrade**: Add a score confidence metric based on how many questions were answered:
```javascript
Engine.getScoreConfidence = function(answers, questions) {
  const progress = Engine.getProgress(answers, questions);
  const completionRate = progress.percent / 100;
  
  // Confidence formula: higher completion → higher confidence
  // Below 50% completion: LOW confidence
  // 50-80%: MEDIUM
  // 80-100%: HIGH
  const confidence = {
    percent: progress.percent,
    level: completionRate >= 0.8 ? 'HIGH' : completionRate >= 0.5 ? 'MEDIUM' : 'LOW',
    margin: parseFloat(((1 - completionRate) * 0.5).toFixed(2)), // ±error margin
    answeredByDimension: {}
  };
  
  // Per-dimension completion
  QG.DIMENSIONS.forEach(dim => {
    const dimQs = questions.filter(q => q.dimension === dim.id);
    const answered = dimQs.filter(q => answers[q.id] > 0).length;
    confidence.answeredByDimension[dim.id] = {
      answered, total: dimQs.length,
      percent: Math.round((answered / dimQs.length) * 100)
    };
  });
  
  return confidence;
};
```

### 🟡 SCORE-004: Monte Carlo Simulation for Quantum Risk Timeline

**Upgrade**: Add a probabilistic model estimating when the organization's crypto will be broken:
```javascript
Engine.estimateQuantumRiskTimeline = function(overallScore, riskMultiplier) {
  // Based on NIST PQC roadmap + Mosca's theorem
  const baseYearRange = { optimistic: 2032, median: 2035, pessimistic: 2040 };
  
  // Adjust based on org's maturity: lower score = earlier effective risk
  const scoreFactor = (4.0 - overallScore) / 3.0; // 0.0 (best) to 1.0 (worst)
  const riskAdjustment = scoreFactor * riskMultiplier * 2; // years earlier
  
  return {
    cryptographicRelevanceTime: Math.round(baseYearRange.median - riskAdjustment),
    migrationWindowYears: Math.max(1, Math.round((baseYearRange.median - riskAdjustment) - 2026)),
    urgency: riskAdjustment > 5 ? 'CRITICAL' : riskAdjustment > 3 ? 'HIGH' : 'MODERATE',
    recommendation: riskAdjustment > 5
      ? 'Begin PQC migration immediately. Your data may already be under "harvest now, decrypt later" operations.'
      : 'Develop a PQC migration roadmap within the next 12 months.'
  };
};
```

### 🟢 SCORE-005: Dimension Score — Configurable Strategy (MIN vs AVG vs Weighted)

**Current**: Uses `Math.min()` (weakest link). This is a valid security model but should be configurable.

**Upgrade**: Allow switching between scoring strategies:
```javascript
Engine.DIMENSION_STRATEGIES = {
  WEAKEST_LINK: (scores) => Math.min(...scores),           // Current
  AVERAGE: (scores) => scores.reduce((a, b) => a + b) / scores.length,
  WEIGHTED_HARMONIC: (scores) => scores.length / scores.reduce((a, s) => a + 1/s, 0),
  GEOMETRIC_MEAN: (scores) => Math.pow(scores.reduce((a, b) => a * b), 1 / scores.length)
};
```

---

## 3. Scanner Engine Technical Upgrades

The current scanner is regex-based. National-grade assessment requires deeper analysis.

### 🔴 SCAN-001: AST-Based Code Analysis (Replace Regex)

**Current**: `scanner-engine.js` uses regex patterns like `/\bRSA\b/gi` which produces false positives on comments, strings, and variable names.

**Upgrade**: Implement a lightweight Abstract Syntax Tree (AST) parser using:
- **JavaScript**: Acorn/Babel for JS/TS files
- **Python**: `ast` module via backend
- **Java**: JavaParser for `.java` files

Benefits:
- Eliminates false positives in comments, strings, and imports
- Enables **call graph analysis** — trace where crypto functions are actually invoked
- Supports **sensitivity analysis** — determine if the finding is in production code or test code

### 🟡 SCAN-002: NIST SP 800-131A Rev.2 Compliance Checking

**Upgrade**: Add a compliance checker against NIST SP 800-131A Rev.2 (Transitioning the Use of Cryptographic Algorithms):
```javascript
const NIST_800_131A = {
  disallowed: ['DES', 'RC4', 'MD5', 'SHA-1', 'RSA-1024', 'DSA-1024', 'EC-160'],
  deprecated: ['3DES', 'RSA-2048', 'SHA-224'],
  acceptable: ['AES-128', 'AES-192', 'AES-256', 'SHA-256', 'SHA-384', 'SHA-512', 'RSA-3072', 'RSA-4096', 'EC-256', 'EC-384'],
  recommended: ['ML-KEM-768', 'ML-KEM-1024', 'ML-DSA-65', 'ML-DSA-87', 'SLH-DSA', 'AES-256-GCM', 'SHA-3']
};
```

### 🟡 SCAN-003: Expanded Language Support

**Current**: Pattern db covers JS, Python, Java, Go, C.

**Upgrade**: Add patterns for:
- **Rust**: `ring`, `rustls`, `openssl-sys` crate patterns
- **Swift**: CryptoKit, Security framework
- **Kotlin/Scala**: JCA patterns
- **C#/.NET**: `System.Security.Cryptography` namespace patterns
- **PHP**: `openssl_*` functions

### 🔴 SCAN-004: Crypto Key Size Extraction

**Current**: Scanner detects RSA usage but doesn't extract the actual key size from the code.

**Upgrade**: Add regex patterns to extract key sizes:
```javascript
// Detect RSA key generation with specific key sizes
/rsa\.GenerateKey\(\s*\w+\s*,\s*(\d+)/        // Go: rsa.GenerateKey(rand, 2048)
/RSA_generate_key_ex\(\s*\w+\s*,\s*(\d+)/     // C: RSA_generate_key_ex(rsa, 2048, ...)
/modulusLength:\s*(\d+)/                        // JS: { modulusLength: 2048 }
/key_size=(\d+)/                                // Python: RSA.generate(key_size=2048)
```

### 🟡 SCAN-005: SARIF Output Format

**Upgrade**: Output scan results in SARIF (Static Analysis Results Interchange Format) v2.1.0 for interop with:
- GitHub Code Scanning
- Azure DevOps
- OWASP tools
- Any CI/CD pipeline

```javascript
Scanner.toSARIF = function(cbom) {
  return {
    "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json",
    version: "2.1.0",
    runs: [{
      tool: { driver: { name: "QuantumGuard Scanner", version: "2.0.0", rules: [...] } },
      results: cbom.assets.map(asset => ({
        ruleId: asset.algorithm,
        level: asset.severity === 'critical' ? 'error' : 'warning',
        message: { text: asset.recommendation },
        locations: [{ physicalLocation: { artifactLocation: { uri: asset.location } } }]
      }))
    }]
  };
};
```

### 🔴 SCAN-006: TLS 1.3 Post-Quantum Key Exchange Detection

**Current**: `_isCipherQuantumVulnerable()` assumes all TLS 1.3 ciphers are quantum-vulnerable because key exchange is separate from cipher selection.

**Upgrade**: Parse the actual key exchange group from SSLyze results and check for ML-KEM/X25519Kyber768 negotiation:
```python
# In sslyze_scanner.py — detect PQC key exchange groups
PQC_KEY_EXCHANGE_GROUPS = {
    'X25519Kyber768Draft00', 'X25519MLKEM768', 'SecP256r1MLKEM768',
    'MLKEM768', 'MLKEM1024', 'X25519Kyber512Draft00'
}
```

### 🟡 SCAN-007: Container Image Crypto Scanning

**Upgrade**: Add the ability to scan Docker/OCI container images for crypto libraries:
- Extract package manifests from layers
- Check system packages (`libssl`, `libgnutls`, `libgcrypt`)
- Identify compiled-in crypto via binary analysis
- Flag containers running deprecated OpenSSL versions

### 🟢 SCAN-008: Certificate Transparency Log Monitoring

**Upgrade**: Integrate with Certificate Transparency (CT) logs to:
- Monitor all certificates issued for the organization's domains
- Alert on certificates using quantum-vulnerable algorithms
- Track certificate lifecycle and renewal patterns
- Detect unauthorized certificate issuance (mis-issuance detection)

---

## 4. Backend Architecture Overhaul

The backend needs a complete restructure from a simple Flask script to a production-grade service.

### 🔴 BACK-001: API Authentication & Authorization

**Current**: Zero authentication — any client can scan, chat, and access data.

**Upgrade**:
```python
# Add JWT authentication with role-based access
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

app.config['JWT_SECRET_KEY'] = os.environ['JWT_SECRET']
jwt = JWTManager(app)

@app.route('/api/scan', methods=['POST'])
@jwt_required()
def scan():
    current_user = get_jwt_identity()
    # Rate limit per user, log audit trail
    ...
```

### 🔴 BACK-002: Rate Limiting & Abuse Prevention

**Upgrade**:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/scan', methods=['POST'])
@limiter.limit("10 per hour")    # TLS scans are expensive
def scan(): ...

@app.route('/api/chat', methods=['POST'])
@limiter.limit("60 per hour")    # AI chat rate limit
def chat(): ...
```

### 🟡 BACK-003: SSRF Prevention (Hostname Blocklist)

**Current**: Any hostname can be scanned, including `localhost`, `127.0.0.1`, internal IPs.

**Upgrade**:
```python
import ipaddress, socket

BLOCKED_NETWORKS = [
    ipaddress.ip_network('127.0.0.0/8'),       # Loopback
    ipaddress.ip_network('10.0.0.0/8'),         # Private
    ipaddress.ip_network('172.16.0.0/12'),      # Private
    ipaddress.ip_network('192.168.0.0/16'),     # Private
    ipaddress.ip_network('169.254.0.0/16'),     # Link-local
    ipaddress.ip_network('fc00::/7'),           # IPv6 private
]

def validate_hostname(hostname):
    """Prevent SSRF by blocking internal network scans."""
    try:
        resolved_ips = socket.getaddrinfo(hostname, None)
        for _, _, _, _, addr in resolved_ips:
            ip = ipaddress.ip_address(addr[0])
            for network in BLOCKED_NETWORKS:
                if ip in network:
                    raise ValueError(f"Scanning internal network hosts is forbidden: {hostname}")
    except socket.gaierror:
        raise ValueError(f"DNS resolution failed for {hostname}")
```

### 🟡 BACK-004: Async Scan Queue with Task Status

**Current**: Scan is synchronous — client blocks until SSLyze completes (can take 30+ seconds).

**Upgrade**: Implement async scanning with a task queue:
```python
# POST /api/scan → returns task_id
# GET /api/scan/{task_id} → returns status (pending/running/completed/failed) + results

import uuid
from concurrent.futures import ThreadPoolExecutor

scan_tasks = {}  # In production: use Redis or Firestore
executor = ThreadPoolExecutor(max_workers=4)

@app.route('/api/scan', methods=['POST'])
def initiate_scan():
    task_id = str(uuid.uuid4())
    hostname = data['hostname']
    scan_tasks[task_id] = {'status': 'pending', 'hostname': hostname}
    executor.submit(_run_scan_task, task_id, hostname, port)
    return jsonify({'task_id': task_id, 'status': 'pending'}), 202

@app.route('/api/scan/<task_id>', methods=['GET'])
def get_scan_status(task_id):
    task = scan_tasks.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify(task)
```

### 🟡 BACK-005: OpenAPI/Swagger Documentation

**Upgrade**: Add auto-generated API documentation:
```python
from flask_restx import Api, Resource, fields

api = Api(app, 
    title='QuantumGuard API',
    version='2.0',
    description='Post-Quantum Cryptography Assessment & Scanning API'
)

scan_model = api.model('ScanRequest', {
    'hostname': fields.String(required=True, description='Target hostname'),
    'port': fields.Integer(default=443, description='Target port'),
    'scan_subdomains': fields.Boolean(default=False, description='Enable subdomain discovery')
})
```

### 🟢 BACK-006: Structured Logging & Audit Trail

**Upgrade**:
```python
import structlog

logger = structlog.get_logger()

@app.route('/api/scan', methods=['POST'])
def scan():
    logger.info("scan_initiated", 
        hostname=hostname, 
        user_id=current_user,
        source_ip=request.remote_addr,
        timestamp=datetime.utcnow().isoformat()
    )
```

---

## 5. Security Hardening

### 🔴 SEC-001: Content Security Policy (CSP)

**Current**: No CSP headers → vulnerable to XSS injection.

**Upgrade** (add to `firebase.json` / `vercel.json`):
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdn.tailwindcss.com fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://*.cloudfunctions.net"
}
```

### 🔴 SEC-002: Subresource Integrity (SRI)

**Current**: CDN scripts loaded without integrity verification.

**Upgrade**: Add SRI hashes to all external scripts:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        integrity="sha384-<hash>"
        crossorigin="anonymous"></script>
```

### 🟡 SEC-003: CORS Restriction

**Current**: `CORS(app)` allows ALL origins.

**Upgrade**:
```python
CORS(app, origins=[
    'https://quantum-guard.web.app',
    'https://quantum-guard.firebaseapp.com',
    'http://localhost:3000'  # dev only
])
```

### 🟡 SEC-004: Input Sanitization & Validation

**Upgrade**: Add comprehensive input validation using schemas:
```python
from marshmallow import Schema, fields, validate

class ScanRequestSchema(Schema):
    hostname = fields.String(required=True, validate=[
        validate.Length(min=3, max=253),
        validate.Regexp(r'^[a-zA-Z0-9]([a-zA-Z0-9\-\.]*[a-zA-Z0-9])?$')
    ])
    port = fields.Integer(missing=443, validate=validate.Range(min=1, max=65535))
```

### 🟡 SEC-005: Strict Transport Security (HSTS)

```json
{
  "key": "Strict-Transport-Security",
  "value": "max-age=63072000; includeSubDomains; preload"
}
```

---

## 6. Frontend Architecture Reform

### 🔴 FRONT-001: Extract Tailwind Configuration

**Current**: Full Tailwind config duplicated 8+ times across HTML files.

**Upgrade**: Create `tailwind-config.js`:
```javascript
// tailwind-config.js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        // All 70+ custom colors defined once
        'quantum-cyan': '#00D4FF',
        'quantum-blue': '#1E1E3A',
        ...
      }
    }
  }
};
```
Then load once per page: `<script src="tailwind-config.js"></script>`

### 🟡 FRONT-002: Extract Inline JavaScript to Modules

**Current**: ~1000+ lines of JavaScript embedded in `<script>` tags across 8 HTML files.

**Upgrade**: Extract to separate `.js` files:
```
frontend/
├── js/
│   ├── quick-assessment.js
│   ├── comprehensive-assessment.js
│   ├── results.js
│   ├── compliance.js
│   ├── org-profile.js
│   ├── tools.js
│   └── shared/
│       ├── navigation.js
│       ├── notifications.js
│       └── charts.js
```

### 🟡 FRONT-003: Toast Notification System (Replace native alerts)

**Current**: Uses `alert()` and `confirm()` — poor UX for a professional platform.

**Upgrade**: Implement a glass-morphism toast system:
```javascript
const Toast = {
  show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-card`;
    toast.innerHTML = `
      <span class="material-symbols-outlined">${icons[type]}</span>
      <span>${message}</span>
    `;
    document.getElementById('toast-container').appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-enter'));
    setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, duration);
  },
  success: (msg) => Toast.show(msg, 'success'),
  error: (msg) => Toast.show(msg, 'error'),
  warning: (msg) => Toast.show(msg, 'warning'),
};
```

### 🟢 FRONT-004: Responsive Mobile Navigation

**Current**: Mobile nav is hidden with `hidden md:flex` and no hamburger menu.

**Upgrade**: Add slide-out mobile drawer with glass-morphism design.

### 🟢 FRONT-005: Accessibility (WCAG 2.1 AA)

**Upgrade**:
- Add `aria-label` to all interactive elements
- Keyboard navigation for all components (not just quick assessment)
- Color contrast ratios ≥ 4.5:1
- Focus management and skip-to-content links
- Screen reader announcements for dynamic content

### 🟢 FRONT-006: Dark/Light Theme Toggle

**Current**: Dark mode toggle button exists on index.html but has no functionality.

**Upgrade**: Implement actual CSS-variables-based dark/light switching with `prefers-color-scheme` detection and localStorage persistence.

---

## 7. Data Layer & Persistence

### 🔴 DATA-001: Data Schema Versioning

**Current**: localStorage stores raw JSON with no version tracking. Schema changes break existing data.

**Upgrade**:
```javascript
const SCHEMA_VERSION = 2;

Engine.storage.save = function(key, data) {
  const envelope = {
    _version: SCHEMA_VERSION,
    _timestamp: Date.now(),
    data: data
  };
  localStorage.setItem('qg_' + key, JSON.stringify(envelope));
};

Engine.storage.load = function(key) {
  const raw = localStorage.getItem('qg_' + key);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (parsed._version !== SCHEMA_VERSION) {
    return Engine.storage.migrate(key, parsed);
  }
  return parsed.data;
};
```

### 🟡 DATA-002: Firestore Persistence (Cloud Sync)

**Upgrade**: Store assessment results in Firestore for:
- Cross-device access
- Historical trend analysis
- Multi-user collaboration
- Organizational dashboards

```javascript
// Save assessment to Firestore
async function saveToFirestore(result) {
  const db = firebase.firestore();
  await db.collection('assessments').add({
    orgId: result.orgProfile.id,
    type: result.type, // 'quick' or 'comprehensive'
    scores: result.scores,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    version: SCHEMA_VERSION
  });
}
```

### 🟡 DATA-003: Assessment History & Delta Analysis

**Upgrade**: Enable comparing assessments over time:
```javascript
Engine.compareAssessments = function(current, previous) {
  const delta = { dimensions: {}, overall: {} };
  delta.overall = {
    current: current.overall,
    previous: previous.overall,
    change: parseFloat((current.overall - previous.overall).toFixed(2)),
    trend: current.overall > previous.overall ? 'improving' : 'declining'
  };
  // Per-dimension and per-practice deltas...
  return delta;
};
```

### 🟡 DATA-004: Assessment Data Validation

**Upgrade**: Add schema validation to all data operations:
```javascript
Engine.validateAnswers = function(answers, questions) {
  const errors = [];
  Object.entries(answers).forEach(([qId, score]) => {
    const question = questions.find(q => q.id === parseInt(qId));
    if (!question) errors.push(`Unknown question ID: ${qId}`);
    if (score < 1 || score > 4) errors.push(`Invalid score for Q${qId}: ${score}`);
  });
  return { valid: errors.length === 0, errors };
};
```

---

## 8. Compliance & Standards Expansion

### 🔴 COMP-001: Additional Compliance Frameworks

**Current**: 4 frameworks (NIST PQC, CMMC 2.0, FedRAMP, FISMA).

**Upgrade**: Add 6 more frameworks critical for national-grade assessment:

| Framework | Region | Description |
|---|---|---|
| **CNSA 2.0** | US/NATO | NSA Commercial National Security Algorithm Suite 2.0 |
| **ISO/IEC 27001:2022** | International | Information security management with Annex A crypto controls |
| **ETSI QSC ISG** | EU | European quantum-safe cryptography recommendations |
| **NSM 10 (Norway)** | Nordic | National Security Authority guidelines |
| **NIST CSF 2.0** | US | Cybersecurity Framework with PQC integration |
| **DPDPA 2023** | India | Digital Personal Data Protection with crypto requirements |

### 🟡 COMP-002: Control-Level Mapping (not just Practice-Level)

**Current**: Compliance maps at practice level (12 practices → frameworks).

**Upgrade**: Map individual questions to specific controls:
```javascript
// Example: Map question 15 to specific NIST controls
{ id: 15, controls: {
    'NIST_PQC': ['PQC-IA-1', 'PQC-IA-3'],
    'CMMC': ['IA.L2-3.5.3'],
    'ISO27001': ['A.8.24', 'A.8.25']
  }
}
```

### 🟡 COMP-003: Automated Remediation Roadmap

**Upgrade**: Generate prioritized remediation plans:
```javascript
Engine.generateRemediationRoadmap = function(scoreBreakdown, complianceGaps) {
  const roadmap = {
    immediate: [],   // 0-30 days: critical fixes
    shortTerm: [],   // 30-90 days: high-priority improvements
    mediumTerm: [],  // 90-180 days: systematic upgrades
    longTerm: []     // 180-365 days: optimization
  };
  
  // Prioritize by: (1) severity of gap, (2) compliance requirement, (3) ease of fix
  complianceGaps.forEach(gap => {
    const priority = calculatePriority(gap);
    roadmap[priority.bucket].push({
      practice: gap.practice,
      currentScore: gap.score,
      targetScore: gap.target,
      steps: generateSteps(gap),
      estimatedEffort: gap.effort,
      complianceImpact: gap.frameworks
    });
  });
  
  return roadmap;
};
```

---

## 9. Observability & Reliability

### 🟡 OBS-001: Error Boundary & Graceful Degradation

**Upgrade**: Wrap all critical operations in error boundaries:
```javascript
Engine.safecalculate = function(fn, fallback = 0) {
  try {
    return fn();
  } catch (error) {
    console.error('[QuantumGuard Engine Error]', error);
    Engine.reportError({ module: 'engine', error: error.message, stack: error.stack });
    return fallback;
  }
};
```

### 🟡 OBS-002: Performance Monitoring

**Upgrade**: Track key performance metrics:
```javascript
const Perf = {
  mark(label) { performance.mark(`qg_${label}`); },
  measure(label, start, end) {
    performance.measure(`qg_${label}`, `qg_${start}`, `qg_${end}`);
    const measure = performance.getEntriesByName(`qg_${label}`)[0];
    return measure.duration;
  }
};

// Usage
Perf.mark('score_start');
const scores = Engine.getFullScoreBreakdown(answers, questions);
Perf.mark('score_end');
console.log(`Scoring took ${Perf.measure('scoring', 'score_start', 'score_end')}ms`);
```

### 🟢 OBS-003: Automated Unit Tests

**Upgrade**: Add comprehensive test coverage for:
- `engine.js` scoring logic (pure functions → easy to test)
- `scanner-engine.js` pattern matching
- `data.js` data integrity validation
- Backend API endpoints

Tests should be runnable via `npm test` or `pytest`.

### 🟢 OBS-004: CI/CD Pipeline

**Upgrade**: Add GitHub Actions pipeline:
```yaml
name: QuantumGuard CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Frontend Tests
        run: npx vitest run
      - name: Run Backend Tests
        run: pip install -r requirements.txt && pytest
      - name: Lint
        run: npx eslint frontend/js/ && flake8 backend/
      - name: Security Scan
        run: npx audit-ci --moderate
```

---

## 10. Implementation Priority Matrix

| # | Upgrade | Severity | Effort | Phase | Dependencies |
|---|---|---|---|---|---|
| BUG-001 | Practice ID Mismatch | 🔴 | S | **Immediate** | None |
| BUG-002 | Donut Chart Double-Count | 🔴 | S | **Immediate** | None |
| BUG-003 | Auto-Advance Bug | 🟡 | S | **Immediate** | None |
| BUG-004 | Compliance Null Ref | 🔴 | S | **Immediate** | None |
| SEC-001 | Content Security Policy | 🔴 | S | Phase 1 | None |
| SEC-002 | Subresource Integrity | 🔴 | S | Phase 1 | None |
| BACK-001 | API Authentication | 🔴 | M | Phase 1 | None |
| BACK-002 | Rate Limiting | 🔴 | S | Phase 1 | BACK-001 |
| BACK-003 | SSRF Prevention | 🟡 | S | Phase 1 | None |
| FRONT-001 | Tailwind Config Extract | 🔴 | S | Phase 1 | None |
| SCORE-001 | Risk Multiplier Integration | 🟡 | S | Phase 2 | BUG-001 |
| SCORE-002 | Weighted Dimension Scoring | 🟡 | S | Phase 2 | BUG-001 |
| SCORE-003 | Score Confidence Metric | 🔴 | M | Phase 2 | BUG-001 |
| SCORE-004 | Quantum Risk Timeline | 🟡 | M | Phase 2 | SCORE-001 |
| SCAN-001 | AST-Based Analysis | 🔴 | XL | Phase 3 | None |
| SCAN-002 | NIST 800-131A Checker | 🟡 | M | Phase 2 | None |
| SCAN-004 | Key Size Extraction | 🔴 | M | Phase 2 | None |
| SCAN-005 | SARIF Output | 🟡 | M | Phase 3 | None |
| SCAN-006 | PQC Key Exchange Detection | 🔴 | M | Phase 2 | None |
| BACK-004 | Async Scan Queue | 🟡 | L | Phase 3 | BACK-001 |
| BACK-005 | OpenAPI Documentation | 🟡 | M | Phase 2 | None |
| DATA-001 | Schema Versioning | 🔴 | S | Phase 1 | None |
| DATA-002 | Firestore Persistence | 🟡 | L | Phase 3 | BACK-001, DATA-001 |
| COMP-001 | 6 New Frameworks | 🔴 | L | Phase 2 | BUG-001 |
| COMP-002 | Control-Level Mapping | 🟡 | XL | Phase 3 | COMP-001 |
| FRONT-002 | Extract Inline JS | 🟡 | L | Phase 2 | FRONT-001 |
| FRONT-003 | Toast Notifications | 🟡 | S | Phase 1 | None |
| OBS-003 | Unit Tests | 🟢 | L | Phase 2 | FRONT-002 |
| OBS-004 | CI/CD Pipeline | 🟢 | M | Phase 3 | OBS-003 |

### Phase Timeline

| Phase | Timeline | Focus |
|---|---|---|
| **Immediate** | Day 1 | Fix 4 critical bugs that break scoring |
| **Phase 1** | Week 1–2 | Security hardening + frontend cleanup |
| **Phase 2** | Week 3–6 | Scoring engine + scanner upgrades + compliance expansion |
| **Phase 3** | Week 7–12 | Backend overhaul + persistence + AST analysis + CI/CD |

---

## Summary of Impact

| Metric | Current (MVP) | After Upgrade |
|---|---|---|
| **Scoring Accuracy** | ~50% (broken for DPE/ITR) | 100% (validated) |
| **Scanner Languages** | 5 (regex) | 10+ (AST-aware) |
| **Compliance Frameworks** | 4 | 10 |
| **API Security** | None (open) | JWT + RBAC + rate limiting |
| **Test Coverage** | 0% | 80%+ |
| **WCAG Compliance** | None | AA |
| **Output Formats** | JSON | JSON + SARIF + PDF |
| **Data Persistence** | localStorage | Firestore + cloud sync |
| **Error Handling** | Crash | Graceful degradation |
| **PQC Detection** | Pattern match | AST + key sizes + CNSA 2.0 |

> **Total Upgrades**: 47 items across 9 domains
> **Estimated Effort**: 8–12 weeks for a team of 2–3 engineers

---

*This document serves as the technical blueprint for transforming QuantumGuard from a hackathon prototype into a national-grade quantum readiness assessment platform.*
