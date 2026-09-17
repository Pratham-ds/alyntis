# Alyntis

### From Consumers to Makers — Preparing Minds to Build the Future

[![Website](https://img.shields.io/badge/Website-alyntis.in-blue?style=flat-square)](https://alyntis.in)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast%20Build-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🌐 Live Website

**https://alyntis.in**

Alyntis is a technology-driven learning platform designed to help students move beyond consuming technology and start **building, experimenting, solving problems, and innovating**.

The platform provides structured, class-wise learning experiences across Robotics, Artificial Intelligence, Machine Learning, IoT, Electronics, Embedded Systems, Drone Technology, 3D Printing, Programming, and STEM innovation.

---

## 🚀 About Alyntis

Alyntis is an educational technology platform focused on practical, project-based learning in emerging technologies.

Students explore structured courses, real-world projects, learning resources, and quizzes according to their class or learning level.

> **Don't just teach students how technology works. Teach them how to use technology to build something meaningful.**

---

## 🎯 Vision

### From Consumers to Makers

Alyntis aims to prepare students to become creators, builders, problem-solvers, and innovators.

The learning approach follows:

```text
Learn
  ↓
Understand
  ↓
Experiment
  ↓
Build
  ↓
Test
  ↓
Improve
  ↓
Innovate
```

---

## 🏫 Built for Schools

Alyntis is designed with schools and educational institutions in mind.

The platform supports structured technology and STEM learning where students progressively develop technical skills according to their class and learning level.

### Learning Progression

```text
Foundation
    ↓
Computational Thinking
    ↓
Programming & Electronics
    ↓
Robotics & IoT
    ↓
Artificial Intelligence
    ↓
Machine Learning
    ↓
Drone Technology
    ↓
3D Printing & Prototyping
    ↓
Advanced Innovation Projects
```

---

## 📚 Platform Structure

Alyntis organizes educational content into a clear hierarchy:

```text
Class / Learning Level
        │
        ├── Courses
        │
        ├── Projects
        │     ├── Overview
        │     ├── Learning Objectives
        │     ├── Components
        │     ├── Implementation
        │     ├── Expected Outcome
        │     └── Resources
        │
        └── Quizzes
              ├── Questions
              ├── Student Answers
              ├── Score
              ├── Percentage
              └── Answer Review
```

Students are shown content relevant to their selected class or learning level.

---

## 🧩 Core Features

### 📖 Class-wise Learning

Learning content is organized by class, learning level, technology, course, and project so students can follow a structured learning journey.

### 🤖 Robotics

Practical learning involving sensors, motors, actuators, microcontrollers, robot control, automation, and autonomous systems.

### 🧠 Artificial Intelligence

Introduces AI fundamentals, intelligent systems, computer vision, AI-powered applications, Generative AI, and real-world use cases.

### 📊 Machine Learning

Covers data collection, preprocessing, model training, classification, prediction, computer vision, and practical ML applications.

### 🌐 Internet of Things

Explores sensors, microcontrollers, connected devices, data collection, automation, smart systems, and cloud-connected applications.

### 🔌 Electronics & Embedded Systems

Includes Arduino, ESP-based systems, microcontrollers, digital electronics, sensors, LEDs, motors, actuators, and embedded programming.

### 🚁 Drone Technology

Advanced learning around drone fundamentals, flight controllers, sensors, autonomous navigation, mission planning, computer vision, and drone applications.

### 🖨️ 3D Printing

Introduces 3D modeling, CAD fundamentals, design for 3D printing, slicing, printing workflows, prototyping, and product development.

---

## 🔬 Project-Based Learning

Projects are a core part of the Alyntis learning experience. Students apply concepts from their courses to practical, real-world problems.

Projects can include:

- Project title and overview
- Cover image
- Class / learning level
- Technology category
- Difficulty level
- Learning objectives
- Required components
- Step-by-step implementation
- Expected outcome
- Learning resources
- Additional references

Projects are structured according to the student's learning level and connected to relevant courses.

---

## 📝 Interactive Quizzes

Alyntis provides quizzes associated with courses and projects.

### During a quiz

- Students can read questions and select answers.
- Correct answers remain hidden while the quiz is in progress.

### After submission

Students can review:

- Score
- Percentage
- Selected answers
- Correct answers
- Quiz results
- Answer review

This provides immediate feedback while protecting assessment integrity during the quiz.

---

## 👨‍💼 Admin Panel

Authorized administrators can manage educational content through the administration interface.

Administrators can manage:

- Courses
- Projects
- Classes / learning levels
- Quizzes
- Learning resources
- Project information
- Course information
- Cover images
- Educational content

This allows the curriculum to evolve without requiring frontend code changes for every new course or project.

---

## 🔐 Security

Alyntis uses Supabase for authentication, database services, and storage.

The platform is designed around:

- Authentication
- Authorization
- Role-based access
- Row Level Security (RLS)
- Student/admin separation
- Protected administrative operations
- Protected quiz answers
- Secure database access
- Controlled file storage

### Security Notice

Never expose Supabase secret or service-role keys in the frontend. Frontend applications should use only the appropriate public/publishable credentials.

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage

### Deployment

- Vercel
- GitHub

### Development

- Node.js
- npm
- Git
- GitHub

---

## 📁 Project Structure

A simplified project structure:

```text
alyntis/
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

The project structure may evolve as the platform grows.

---

## ⚙️ Getting Started

### Prerequisites

Install:

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/Pratham-ds/alyntis.git
cd alyntis
```

### Install Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Never commit `.env` files containing credentials to GitHub.

Never expose Supabase `service_role` or secret keys in the frontend application.

---

## 💻 Run Locally

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Deployment

Alyntis is deployed using Vercel.

```text
GitHub
   │
   ▼
main branch
   │
   ▼
Vercel
   │
   ▼
Production Build
   │
   ▼
alyntis.in
   │
   ▼
Supabase
```

### Production Website

**https://alyntis.in**

---

## 🔄 Development Workflow

Recommended workflow:

```text
Create Feature
      ↓
Development
      ↓
Local Testing
      ↓
Commit
      ↓
Push to GitHub
      ↓
Pull Request
      ↓
Code Review
      ↓
Merge
      ↓
Vercel Deployment
      ↓
Production Testing
```

Before deploying major changes, test authentication, dashboards, class-wise filtering, courses, projects, quizzes, resources, file uploads, database operations, and mobile responsiveness.

---

## 🎓 Educational Philosophy

Alyntis is built around practical learning.

Students should not only know **what technology is**, but also understand:

- How it works
- How to use it
- How to build with it
- How to solve problems using it
- How to improve their solutions

The platform encourages:

- Problem solving
- Computational thinking
- Creativity
- Engineering mindset
- Technical confidence
- Experimentation
- Collaboration
- Product thinking
- Innovation

---

## 🚀 Future Roadmap

Potential future capabilities include:

- [ ] Student progress tracking
- [ ] Teacher dashboards
- [ ] School administration
- [ ] Student achievements
- [ ] Project badges
- [ ] Certificates
- [ ] Advanced analytics
- [ ] Gamification
- [ ] AI-powered learning assistant
- [ ] Adaptive learning
- [ ] Virtual simulations
- [ ] Advanced robotics curriculum
- [ ] Advanced drone curriculum
- [ ] Advanced AI/ML curriculum
- [ ] Advanced 3D printing curriculum
- [ ] School-level technology program management

---

## 🤝 Contributing

Alyntis is currently maintained as a proprietary project.

For authorized development:

1. Create a feature branch.
2. Implement the change.
3. Test locally.
4. Commit the changes.
5. Push the branch.
6. Create a Pull Request.
7. Review the changes.
8. Merge after approval.

---

## 📄 License

This project is currently maintained as a proprietary educational technology platform.

The source code, branding, curriculum structure, educational content, designs, and other proprietary materials may not be commercially redistributed, copied, or reused without authorization from the Alyntis team.

---

## 📬 Contact

For business inquiries, school partnerships, collaborations, or general information:

**Email:** info@alyntis.in

**Website:** https://alyntis.in

---

# 🌟 Alyntis

### From Consumers to Makers.

**Preparing Minds to Build the Future.**
