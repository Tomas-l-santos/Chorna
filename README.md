Chrona — React + Flask Task Manager

Chrona is a to-do list built with a React frontend and a Python Flask API. It uses SQLite so tasks remain saved after the browser is closed.

What works

Add tasks with a title, description, due date, priority, and category

Edit active tasks

Permanently delete active or completed tasks

Mark a task as complete and automatically move it to the Completed page

Filter active tasks by all, today, upcoming, or overdue

Search active tasks

View active tasks in a functional monthly calendar

Click a calendar task to edit it

Responsive desktop and mobile layout

API validation and a confirmation dialog before deletion

Project structure

chrona-todo/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── test_app.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md

1. Start the Python backend

Open a terminal in the backend folder.

Windows PowerShell

python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py

macOS / Linux

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py

The API will run at http://localhost:5000.

2. Start the React frontend

Open a second terminal in the frontend folder.

npm install
npm run dev

Open the local URL shown by Vite, normally http://localhost:5173.

Run the backend test

From the backend folder, with the virtual environment active:

python -m unittest test_app.py

Build the frontend

From the frontend folder:

npm run build

How to explain it in an interview

React stores the visible task list in component state.

useEffect loads tasks from the Flask API when the application opens.

Flask provides CRUD endpoints for creating, reading, updating, completing, and deleting tasks.

SQLite stores the data in backend/tasks.db.

The calendar is made with JavaScript Date objects and a 42-cell month grid, so no calendar package hides the logic.

Components are separated by responsibility to keep the code understandable and maintainable.

Suggested GitHub improvements you can make yourself

Add screenshots or a short GIF to this README

Deploy the frontend and backend

Add task sorting by priority

Add a restore button for completed tasks

Add automated frontend tests

Add user accounts only after you fully understand the current version