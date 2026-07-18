# 3. Scoring Methodology

## 3.1 Overview
The QuantumGuard Post-Quantum Cryptography (PQC) readiness score is derived using a multi-dimensional assessment model. It provides organizations with an objective measure of their vulnerability to "Harvest Now, Decrypt Later" (HNDL) attacks.

## 3.2 Evaluation Dimensions
The methodology evaluates the organization across four critical dimensions:
1. **CVI (Cryptographic Visibility & Inventory)**: The organization's capability to discover, inventory, and track cryptographic assets (keys, certificates, algorithms).
2. **SGRM (Strategic Governance & Risk Management)**: The presence of executive sponsorship, policies, and strategic roadmaps for PQC transition.
3. **DPE (Data Protection Engineering)**: The current implementation of encryption, focusing on agility and the isolation of sensitive data.
4. **ITR (Implementation & Technical Readiness)**: Technical mechanisms in place to deploy and operate quantum-safe algorithms.

## 3.3 The Weakest Link Principle
QuantumGuard employs the **Weakest Link Principle**. Cryptographic security is only as strong as its weakest element.
- **Dimension Score**: Calculated as the *minimum* score among its underlying practices.
- **Overall Score**: The average of the four Dimension Scores.

## 3.4 Maturity Levels
The final averaged score maps to a 5-level maturity tier:
- **1 - Basic (1.0 - 1.4)**: Ad-hoc cryptographic practices. High risk to HNDL.
- **2 - Developing (1.5 - 2.4)**: Initial awareness, but inconsistent visibility.
- **3 - Established (2.5 - 3.4)**: Formalized inventory and risk tracking.
- **4 - Advanced (3.5 - 3.9)**: Cryptographic agility implemented in core systems.
- **5 - Optimizing (4.0)**: Fully quantum-safe, agile, and automated cryptography.
