# 3. Scoring Methodology

## 3.1 Overview
The QuantumGuard Post-Quantum Cryptography (PQC) readiness score is derived using a multi-dimensional assessment model. It provides organizations with an objective measure of their vulnerability to "Harvest Now, Decrypt Later" (HNDL) attacks.

## 3.2 Evaluation Dimensions
The methodology evaluates the organization across four critical dimensions:
1. **CVI (Cryptographic Visibility & Inventory)**: The organization's capability to discover, inventory, and track cryptographic assets (keys, certificates, algorithms).
2. **SGRM (Strategic Governance & Risk Management)**: The presence of executive sponsorship, policies, and strategic roadmaps for PQC transition.
3. **DPE (Data Protection Engineering)**: The current implementation of encryption, focusing on agility and the isolation of sensitive data.
4. **ITR (Implementation & Technical Readiness)**: Technical mechanisms in place to deploy and operate quantum-safe algorithms.

## 3.3 Scoring Mechanism & Weighting
Each question in the assessment maps to one of the four dimensions and utilizes a standard 4-point maturity scale for its answers. 

### 3.3.1 Question-Level Scoring
Responses to each control are assigned a mathematical weight ranging from 1 to 4:
*   **1 Point (Non-Existent / Ad-Hoc)**: No formal process exists; completely vulnerable to quantum threats.
*   **2 Points (Developing)**: Initial discussions or partial visibility, but heavily reliant on manual processes.
*   **3 Points (Established)**: Formalized, documented policies and active cryptographic inventories exist.
*   **4 Points (Optimized / Quantum-Safe)**: Fully automated, agile cryptography utilizing NIST-approved PQC algorithms (e.g., ML-KEM, ML-DSA).

### 3.3.2 Dimension Score Aggregation
QuantumGuard computes the score for each Dimension based on the organization's responses.

**Score Calculation Formula**:
$$ Dimension\_Score = \frac{\sum (Assessed\_Control\_Scores)}{\sum (Maximum\_Possible\_Scores)} \times 4.0 $$

*(The engine scales the final dimension score perfectly to the 1.0 - 4.0 index).*

## 3.4 The Weakest Link Principle
Unlike traditional cybersecurity maturity models that rely heavily on pure averages, QuantumGuard employs the **Weakest Link Principle**. Cryptographic security is only as strong as its weakest element. An organization might have advanced governance (SGRM = 4.0), but if they lack visibility into their cryptographic assets (CVI = 1.0), they are highly susceptible to an HNDL attack.

- **Dimension Score**: In advanced profiles, specific critical controls can artificially cap the entire Dimension score if neglected.
- **Overall Score**: The final Quantum Readiness Score is computed by taking the **Average** of the four dimension scores, but it provides explicit warnings if any dimension falls beneath the "Established" (2.5) threshold.

## 3.5 Maturity Levels Mapping
The final averaged score is mapped to a 5-level maturity tier to provide actionable insights for executives:

| Score Range | Maturity Tier | Profile Characteristics | HNDL Risk |
| :--- | :--- | :--- | :--- |
| **1.0 - 1.4** | **1 - Basic** | Ad-hoc cryptographic practices. Decentralized key management. | **CRITICAL** |
| **1.5 - 2.4** | **2 - Developing** | Initial awareness. Manual spreadsheets for inventory. No agility. | **HIGH** |
| **2.5 - 3.4** | **3 - Established** | Formalized inventory and risk tracking. Automated discovery tools deployed. | **MODERATE** |
| **3.5 - 3.9** | **4 - Advanced** | Cryptographic agility implemented in core systems. Hybrid (Classical/PQC) algorithms tested. | **LOW** |
| **4.0** | **5 - Optimizing** | Fully quantum-safe, agile, and automated cryptography. Native PQC algorithms in production. | **NEGLIGIBLE** |
