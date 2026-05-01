# 🎓 Planer - University Scheduler

> Welcome to the repository of the Solvro project, a student organization at the Wrocław University of Science and Technology!

[![Welcome Page](https://i.imgur.com/dVjBfjS.png)](https://planer.solvro.pl)

## 🎯 Project Goal

The Solvro Planer project aims to create an intuitive and user-friendly application that helps students plan their academic schedule. Our planer is designed to:

- Minimize time spent on manual timetable adjustments
- Provide full control over your schedule

## 👥 Current Team

| Role                                                                  | Member             |
| --------------------------------------------------------------------- | ------------------ |
| Project Manager                                                       | @unewMe            |
| Fullstack Developer / Commander of the Unexpected                     | @D0dii             |
| Fullstack Developer / Solution Wizard                                 | @olekszczepanowski |
| Fullstack Developer / Engineer of the Impossible / Everyday Superhero | @qamarq            |

## 🚀 Technologies

- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
- ![React.js](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Coolify](https://img.shields.io/badge/Coolify-FF0000?style=for-the-badge&logo=coolify&logoColor=white)

## 🔗 Links

[![docs.solvro.pl](https://i.imgur.com/fuV0gra.png)](https://docs.solvro.pl)

- [Live Application](https://planer.solvro.pl)
- [Project Portfolio](https://solvro.pwr.edu.pl/portfolio/planer/)

## 📊 Analytics

We have analytics available at [our analytics dashboard](https://analytics.solvro.pl/share/FlXFbZth4tByVpog/planer.solvro.pl).

For Solvro Planer version 1.0:

[![Analytics](https://i.imgur.com/My4U8lY.png)](https://i.imgur.com)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Solvro/web-planer.git
```

### 2. Install Dependencies

```bash
cd web-planer
npm install
```

### 3. Configure Environment

Create a `.env` file in the `frontend` directory with the following content:

```env
SITE_URL=http://localhost:3000
USOS_CONSUMER_KEY=<your-key>
USOS_CONSUMER_SECRET=<your-key>
USOS_BASE_URL=<your-key-default-for-pwr:usos.pwr.edu.pl>
# Optional — slug registered with the Solvro Alerts service (defaults to "planer")
NEXT_PUBLIC_ALERTS_APP_CODE=planer
```

### 4. Run the Project

```bash
cd frontend && npm run dev
```

### 5. View the Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 Report bugs or suggest improvements
- 🌟 Request new features
- 🧪 Test and provide feedback

## 🔄 Git Workflow

> Don't worry if you forget any steps – our automatic GitHub Action will run checks and notify you of any issues.

### 📘 Solvro GitHub Handbook

Check out our [detailed GitHub workflow guide](https://docs.google.com/document/d/1Sb5lYqYLnYuecS1Essn3YwietsbuLPCTsTuW0EMpG5o/edit?usp=sharing).

### 🔐 SSH Setup

For Windows users, follow this [SSH setup tutorial](https://www.youtube.com/watch?v=vExsOTgIOGw).

### 🌿 Feature Development Workflow

1. Checkout and update main:

   ```bash
   git checkout main
   git pull origin main
   git fetch
   ```

2. Create a feature branch:

   ```bash
   git checkout -b WEB-x_my_feature_branch
   ```

3. Make your changes and commit:

   ```bash
   git add .
   git commit -m "My changes description"
   ```

4. Push to remote:

   ```bash
   git push origin WEB-x_my_feature_branch
   ```

5. Create a Pull Request on GitHub

### ⚠️ Important Reminders

- Never push directly to the main branch
- Always commit before checking out to a different branch
- After successful merge, clean up:

  ```bash
  git branch -d WEB-x_my_feature_branch
  git push origin --delete WEB-x_my_feature_branch
  ```

## 📞 Contact

For questions or suggestions, reach out to us:

- ✉️ Email: <kn.solvro@pwr.edu.pl>
- 🌐 Website: [solvro.pwr.edu.pl](https://solvro.pwr.edu.pl/)
- 📘 Facebook: [KN Solvro](https://www.facebook.com/knsolvro)

---

Thank you for your interest in our project! 🙌
