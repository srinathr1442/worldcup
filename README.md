# ⚽ FIFA Jersey Store (fifacup) — Full-Stack Pipeline

An enterprise-grade, fully automated full-stack web application and CI/CD deployment ecosystem engineered on **AWS**. This repository showcases end-to-end engineering: from a modern UI design and robust Java backend to declarative infrastructure automation, strict static code analysis, containerization, and persistent database hosting.

---

## 🎨 User Interface & Frontend Showcase

The web client provides a clean, responsive application catalog designed to interact directly with backend endpoints.

![FIFA Jersey Store UI](images/Screenshot%202026-07-20%20at%2011.10.45%20PM.jpg)

---

## 🛠️ Software & System Architecture

### 🧩 Core Stack Components
* **Frontend:** Vanilla HTML5 / CSS3 / ES6+ JavaScript
* **Backend:** Java, Spring Boot (`@RestController`), Embedded Tomcat Server
* **Build Automation:** Apache Maven 3.9.16
* **Database Layer:** PostgreSQL (Relational Engine)
* **CI/CD Orchestration:** Jenkins (Pipeline-as-Code)
* **Code Governance:** SonarQube Community Platform
* **Container Layer:** Docker & Docker Hub
* **Cloud Infrastructure:** AWS (EC2 Instances, CloudShell, Linux Admin)

---

## ⚙️ CI/CD Infrastructure Integration

The lifecycle is entirely hands-off, leveraging a strict **Declarative Jenkins Pipeline** that triggers code testing and deployments sequentially.

### 1. Unified Jenkins Pipeline Automation
The automated runner orchestrates SCM pulling, building, vulnerability validation, artifact clean-ups, and deployment stages smoothly.

![Jenkins Pipeline Stage View](images/Screenshot%202026-07-20%20at%2010.30.08%20PM.png)

### 2. Declarative Jenkinsfile Implementation
Engineered using pipeline code blocks to ensure trackable configurations and clean credential separation.

![VS Code Jenkinsfile Code](images/Screenshot%202026-07-20%20at%2011.16.00%20PM_2.jpg)

---

## 🛡️ Code Quality Assurance

Before application staging occurs, the workflow enforces a strict quality gate check through the code validation engine.

### 📊 SonarQube Metrics Validation
The system reviews bugs, vulnerabilities, and code safety, validating code before staging.

![SonarQube Passed Gate](images/Screenshot%202026-07-20%20at%2010.31.59%20PM.png)

### 🔐 Secure Credentials Vaulting
To protect environment boundaries, access points to Docker Hub and SonarQube are handled through a secure global credential management store inside the server core.

![Jenkins Secure Credentials Storage](images/Screenshot%202026-07-20%20at%2010.31.14%20PM.png)

---

## 🐳 Live Cloud & Container Deployment

The application runs directly on an **AWS Ubuntu Linux Instance**, serving isolated live microservices.

### 1. Active Container Workloads
Terminal metrics showing running container tasks (`docker ps -a`) managing live configurations over mapped cloud ports.

![AWS EC2 Terminal Containers running](images/Screenshot%202026-07-20%20at%2010.59.48%20PM_2.png)
![AWS Docker Images Layer](images/Screenshot%202026-07-20%20at%2010.36.03%20PM_2.png)

### 2. PostgreSQL Relational Schema Data Layer
The persistent database environment linked to the platform verified via secure PostgreSQL client connections.

![PostgreSQL Datatables Schema Terminal](images/Screenshot%202026-07-20%20at%2010.56.58%20PM_2.png)
![PostgreSQL List of Relations Map](images/Screenshot%202026-07-20%20at%2010.57.13%20PM_2.png)

### 3. Source Repository Layout
The clean folder structure tracking configuration dependencies, build manifests (`pom.xml`), and environment setup modules.

![GitHub Source Code Structure Layout](images/Screenshot%202026-07-20%20at%2010.31.36%20PM.png)

---

## 💡 Key Engineering Takeaways
* **Pipeline Resilience:** Built logic blocks that handle container clean-ups (`Remove Previous Container`) ensuring deployments don't crash due to port conflicts.
* **Database Isolation:** Kept the database structures accessible through container networks while ensuring relational constraints are safely applied.
* **Secrets Control:** Implemented strict code hygiene by passing variables via hidden system handles instead of clear-text exposure.
