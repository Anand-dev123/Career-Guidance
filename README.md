# Intelligent Career Guidance Platform

An Intelligent Career Guidance Platform designed to help students explore career opportunities, evaluate their skills, identify skill gaps, follow personalized learning paths, and discover relevant internship opportunities.

The project combines Full Stack Web Development, Database Management, Authentication, Recommendation Systems, and Data Structures & Algorithms (DSA).

---

##  Overview

Choosing the right career can be difficult for students because they may not know:

- Which career matches their skills
- Which skills they need to improve
- What learning path they should follow
- Which resources are relevant
- Which internship opportunities match their profile

This platform provides a centralized solution for these requirements.

---

#  Key Features

##  Student Features

###  Authentication
- Student Registration
- Login
- JWT Authentication
- Protected Routes
- Logout
- Forgot Password
- Reset Password

###  Student Dashboard
- Target Career
- Assessment Score
- Skill Progress
- Learning Progress
- Career Recommendations
- Internship Recommendations

###  Career Assessment
- Career-specific questions
- Automatic evaluation
- Overall score calculation
- Skill-wise evaluation
- Assessment result storage

###  Skill Management
- Skill assessment
- Skill level identification
- Skill gap analysis
- Priority skill identification

###  Career Explorer
Students can explore careers such as:

- Software Developer
- Full Stack Developer
- Data Scientist
- AI/ML Engineer
- DevOps Engineer
- Cybersecurity Analyst

Features include:

- Career Search
- Domain Filtering
- Required Skills
- Career Information
- Save/Unsave Careers

###  Personalized Learning Roadmap
Learning paths are generated according to:

- Target Career
- Current Skills
- Skill Gaps
- Learning Priorities

###  Learning Hub
Students can access relevant:

- Courses
- Tutorials
- Documentation
- Videos
- Practice Resources

###  Assignments
- View assignments
- Complete assignments
- Track assignment progress

###  Study Planner
Students can organize their learning and study activities.

###  Resume Analyzer
The platform analyzes resume content and identifies relevant skills.

###  Internship Recommendations
Internship opportunities are matched according to:

- Career
- Student Skills
- Required Skills
- Learning relevance

The platform can use the Adzuna API for internship/job data.

###  Progress Tracking
Students can track:

- Assessment Progress
- Roadmap Progress
- Assignment Progress
- Learning Progress

---

#  Admin Panel

The platform includes an Admin Panel for managing application data.

Admin capabilities include:

- Student Management
- Career Management
- Skill Management
- Question Management
- Roadmap Management
- Learning Resource Management
- Assignment Management
- Internship Management

The admin can perform CRUD operations where required.

---

#  Data Structures & Algorithms

DSA is integrated into the project to support career, skill, roadmap, and recommendation-related functionality.

## Graph

Graphs are used to represent relationships between careers, skills, and learning paths.

Example:

```text
Career
  ↓
Skills
  ↓
Learning Topics
  ↓
Resources
````

## BFS — Breadth First Search

Used for level-wise traversal of connected nodes in career and skill relationships.

## DFS — Depth First Search

Used for depth-wise exploration of connected career and skill paths.

## Topological Sort

Used to represent learning dependencies and determine an appropriate order for topics that have prerequisites.

Example:

```text
HTML
 ↓
CSS
 ↓
JavaScript
 ↓
React
 ↓
Node.js
```

## Skill Graph

Represents relationships between different skills and career requirements.

## Searching & Sorting

Searching and sorting concepts are used while processing and displaying career, skill, resource, and recommendation-related information.

## Matching Algorithms

Algorithmic matching is used for:

* Career recommendation
* Skill matching
* Internship recommendation
* Skill gap identification

---

#  DSA Application in the Project

The project demonstrates practical application of DSA rather than keeping DSA as a completely separate module.

```text
Graph
   ↓
Career & Skill Relationships

BFS / DFS
   ↓
Graph Traversal

Topological Sort
   ↓
Learning Dependencies

Skill Graph
   ↓
Skill Relationships

Searching / Sorting
   ↓
Career & Resource Processing

Matching Algorithms
   ↓
Career & Internship Recommendations
```

This makes the project relevant as both a **Full Stack Web Application** and a **DSA-based academic project**.

---

#  Technology Stack

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* React Router
* Lucide React

## Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcryptjs

## Database

* MongoDB
* Mongoose
* MongoDB Atlas

## External API

* Adzuna API

## Development & Deployment

* Visual Studio Code
* Git
* GitHub
* Vercel
* Node.js-compatible backend hosting

---

#  Security

The application implements:

* JWT-based Authentication
* Protected Routes
* Admin Authorization
* Password Hashing
* Environment Variables for Sensitive Credentials

Sensitive information such as:

```text
MONGO_URI
JWT_SECRET
ADZUNA_APP_ID
ADZUNA_APP_KEY
```

is stored using environment variables and should never be committed to GitHub.

---

#  Application Workflow

```text
Student Registration
        ↓
Login
        ↓
Student Profile
        ↓
Career Assessment
        ↓
Skill Evaluation
        ↓
Career Recommendation
        ↓
Skill Gap Analysis
        ↓
Personalized Roadmap
        ↓
Learning Resources
        ↓
Assignments
        ↓
Internship Recommendation
        ↓
Progress Tracking
```

---

#  Database

MongoDB Atlas is used as the database layer.

The application stores information related to:

* Users
* Careers
* Questions
* Assessments
* Roadmaps
* Assignments
* Learning Resources
* Internships
* Internship Applications
* Study Plans
* Resume Analysis

---

#  Testing

The application has been tested for:

* Student Authentication
* Admin Authentication
* Protected Routes
* Invalid JWT Handling
* Career Assessment
* Career Search
* Skill Evaluation
* Learning Roadmaps
* Learning Resources
* Assignments
* Internship Recommendations
* Admin CRUD Operations
* API Error Handling
* Empty States
* MongoDB Connectivity
* Production Build

Production build can be generated using:

```bash
npm run build
```

#  Future Scope

Future improvements may include:

* AI-based Career Recommendations
* Advanced Semantic Skill Matching
* Embedding-based Recommendations
* LLM-powered Career Guidance
* Advanced Career Analytics
* Real-time Job Market Analysis
* Mobile Application
* Advanced Graph-based Recommendations
* Machine Learning-based Recommendation Models

---

#  Conclusion

The Intelligent Career Guidance Platform provides a centralized solution for students to assess their skills, explore career opportunities, identify skill gaps, follow personalized learning paths, access learning resources, complete assignments, analyze resumes, and discover relevant internships.

The integration of Data Structures and Algorithms demonstrates how DSA concepts can be applied to a real-world Full Stack application.

---

##  Project Type

**Full Stack Web Application + DSA Project**

The project combines:

```text
Web Development
+
Database Management
+
REST APIs
+
Authentication
+
Data Structures & Algorithms
+
Recommendation Systems
