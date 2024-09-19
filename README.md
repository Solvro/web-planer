# Planer - University Scheduler

Welcome to the repository of the Solvro project, a student organization at the Wrocław University of Science and Technology!

[![Welcome Page](https://i.imgur.com/PSnVCNN.png)](https://i.imgur.com)

## Project Goal

The goal of the Solvro Planner project is to create an intuitive and user-friendly application that helps students plan their academic schedule. The planner is designed to minimize the time spent manually adjusting the timetable while giving full control over the schedule.

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
- Colify
- Directus CMS

## Links
- https://planer.solvro.pl
- https://solvro.pwr.edu.pl

## Statistics

Statistics for Solvro Planner version 1.0

[![Statistics](https://i.imgur.com/My4U8lY.png)](https://i.imgur.com)


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

## Contact

If you have any questions, suggestions, or would like to learn more about the project, contact us:

- Email: kn.solvro@pwr.edu.pl
- Website: [solvro.pwr.edu.pl](https://solvro.pwr.edu.pl/)
- Facebook: Solvro

Thank you for your interest in our project!

## Deployment

[Coolify](https://coolify.io/) - An online platform offering the ability to host your own web applications, similar to Heroku, Netlify, or Vercel, but open-source and self-hostable on your own server.

Currently, the site is hosted on a VPS from the IT Department, and it must be renewed every year. For access to Coolify, you should contact @Rei-x, @dawidlinek, @Szymczek, or @karbowskijakub.

Coolify address: https://devops.solvro.pl

For each pull request, a Preview Deployment is automatically created, and Coolify adds a comment with a link to this version.

Everything on the main branch is automatically deployed to production.

## CMS

We use [Directus CMS](https://directus.io/), available at https://cms.solvro.pl. For access, request the same people responsible for access to Coolify.

All content is fetched during the build process, and to update things on the site, you need to update them in the CMS and wait for the site to rebuild (this happens automatically as Directus is connected to a webhook in Coolify). You can monitor this in the Deployments tab in Coolify.

## Analytics

We have analytics set up at https://analytics.solvro.pl

## Uptime 

Monitoring - https://uptime.solvro.pl/status/solvro
