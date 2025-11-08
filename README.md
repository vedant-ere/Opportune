# Application Tracker

A modern web application to track and manage job applications with Kanban board visualization.

## Technologies

- **Frontend**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ApplicationForm.jsx
│   ├── KanbanBoard.jsx
│   ├── MainCard.jsx
│   ├── Statistics.jsx
│   └── ...
├── pages/              # Page components
│   └── LandingPage.jsx
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Getting Started

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Features

- Kanban board view for application tracking
- Application statistics dashboard
- Form-based application entry
- Responsive design with Tailwind CSS
