# Planer - University Scheduler

Welcome to the repository of the Solvro project, a student organization at the Wrocław University of Science and Technology!

[![Welcome Page](https://i.imgur.com/PSnVCNN.png)](https://i.imgur.com)

## Project Goal

The goal of the Solvro Planer project is to create an intuitive and user-friendly application that helps students plan their academic schedule. The planer is designed to minimize the time spent manually adjusting the timetable while giving full control over the schedule.

## Current Team

- @Szymczek - Project Manager
- @Rei-x - Techlead
- @unewMe - Fullstack Developer
- @D0dii - Fullstack Developer
- @olekszczepanowski - Fullstack Developer

## Technologies

- Next.js
- React.js
- Tailwind
- Typescript
- Coolify

## Links

- https://planer.solvro.pl
- https://solvro.pwr.edu.pl/portfolio/planer/

## Analitics

We have analytics available at https://analytics.solvro.pl/share/FlXFbZth4tByVpog/planer.solvro.pl

For Solvro Planer version 1.0 below.

[![Analitics](https://i.imgur.com/My4U8lY.png)](https://i.imgur.com)

## Getting Started

### Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Solvro/web-planer.git
```

### Install Dependencies

Go to the project directory and install all required dependencies using npm:

```bash
cd web-planer
npm install
```

### Fill .env file

To configure the application, you need to create a .env file in the root directory of the project and fill it with the following environment variables:

```bash
SITE_URL=http://localhost:3000
USOS_CONSUMER_KEY=<your-key>
USOS_CONSUMER_SECRET=<your-key>
USOS_BASE_URL=<your-key-default-for-pwr:usos.pwr.edu.pl>
```

### Run the Project

After installing the dependencies, run the project locally on your computer:

```bash
npm run dev
```

### View the Application

After starting the project, open your web browser and navigate to http://localhost:3000 to see the running application.

## Contributing to the Project

If you would like to contribute to the development of this project, we encourage you to:

- Report issues related to bugs or improvement suggestions,
- Request features by creating pull requests,
- Test and provide feedback on the project.

## Github workflow

Don't worry if you've forgotten about the steps, automatic gh action will run the checks for you and notify if somthing's wrong.

## Working with git

### Github Solvro Handbook 🔥

https://docs.google.com/document/d/1Sb5lYqYLnYuecS1Essn3YwietsbuLPCTsTuW0EMpG5o/edit?usp=sharing

### SSH

Connecting to Github(Gh) repository via SSH on Windows, tutorial: https://www.youtube.com/watch?v=vExsOTgIOGw

### Building new feature

1. git checkout main -> checkout main branch
2. git pull origin main -> pull current changes from main branch
3. git fetch -> be up to date with remote branches
4. git checkout -b WEB-x_my_feature_branch -> x - stands for issue number; it is going to checkout and create new branch name WEB-x_my_feature_branch
   (... working on the feature, we are still on our branch named WEB-x_my_feature_branch)
5. git add . -> add all changes we have made
6. git commit -m "My changes description" -> commit made changes with proper description
7. git push origin WEB-x_my_feature_branch -> pushing our changes to remote branch
8. On Github we are going to make Pull Request (PR) from our remote branch

### Remarks

- Do not push directly to main branch!!! This is bad practice!
- local branch - is our branch on our computer not on the server if we do some chagnes and do checkout to diffrent branch without saving them(commiting) we might loose them, commit before checkout to different branch!
- remote branch - this is branch with our code in github's servers
- After code review which was successful, we can merge from our feature branch to main branch. After merging we should clean after ourself.

1. git branch -d WEB-x_my_feature_branch -> deletes our local branch
2. git push origin --delete WEB-x_my_feature_branch -> delete our remote branch

## Contact

If you have any questions, suggestions, or would like to learn more about the project, contact us:

- Email: kn.solvro@pwr.edu.pl
- Website: [solvro.pwr.edu.pl](https://solvro.pwr.edu.pl/)
- Facebook: https://www.facebook.com/knsolvro

Thank you for your interest in our project!
