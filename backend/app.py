from datetime import datetime, timezone
from pathlib import Path
import sqlite3

from flask import Flask, jsonify, request


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "tasks.db"

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    """Allow the React development server to use the API."""
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    return response


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def task_to_dict(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"],
        "dueDate": row["due_date"],
        "priority": row["priority"],
        "category": row["category"],
        "completed": bool(row["completed"]),
        "createdAt": row["created_at"],
        "completedAt": row["completed_at"],
    }


def init_database():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                due_date TEXT NOT NULL,
                priority TEXT NOT NULL DEFAULT 'Medium',
                category TEXT NOT NULL DEFAULT 'General',
                completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                completed_at TEXT
            )
            """
        )


def validate_task(payload):
    title = str(payload.get("title", "")).strip()
    due_date = str(payload.get("dueDate", "")).strip()
    priority = str(payload.get("priority", "Medium")).strip()
    category = str(payload.get("category", "General")).strip()

    errors = []
    if not title:
        errors.append("A task title is required.")
    if not due_date:
        errors.append("A due date is required.")
    if priority not in {"Low", "Medium", "High"}:
        errors.append("Priority must be Low, Medium, or High.")
    if len(title) > 100:
        errors.append("The title must be 100 characters or fewer.")
    if len(category) > 30:
        errors.append("The category must be 30 characters or fewer.")

    return errors


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok"})


@app.get("/api/tasks")
def get_tasks():
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT * FROM tasks
            ORDER BY completed ASC, due_date ASC, created_at DESC
            """
        ).fetchall()
    return jsonify([task_to_dict(row) for row in rows])


@app.post("/api/tasks")
def create_task():
    payload = request.get_json(silent=True) or {}
    errors = validate_task(payload)
    if errors:
        return jsonify({"errors": errors}), 400

    created_at = now_iso()
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO tasks (title, description, due_date, priority, category, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                payload["title"].strip(),
                str(payload.get("description", "")).strip(),
                payload["dueDate"],
                payload.get("priority", "Medium"),
                str(payload.get("category", "General")).strip() or "General",
                created_at,
            ),
        )
        task_id = cursor.lastrowid
        row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

    return jsonify(task_to_dict(row)), 201


@app.put("/api/tasks/<int:task_id>")
def update_task(task_id):
    payload = request.get_json(silent=True) or {}
    errors = validate_task(payload)
    if errors:
        return jsonify({"errors": errors}), 400

    with get_connection() as connection:
        existing = connection.execute("SELECT id FROM tasks WHERE id = ?", (task_id,)).fetchone()
        if existing is None:
            return jsonify({"error": "Task not found."}), 404

        connection.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, due_date = ?, priority = ?, category = ?
            WHERE id = ?
            """,
            (
                payload["title"].strip(),
                str(payload.get("description", "")).strip(),
                payload["dueDate"],
                payload.get("priority", "Medium"),
                str(payload.get("category", "General")).strip() or "General",
                task_id,
            ),
        )
        row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

    return jsonify(task_to_dict(row))


@app.patch("/api/tasks/<int:task_id>/complete")
def complete_task(task_id):
    with get_connection() as connection:
        existing = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
        if existing is None:
            return jsonify({"error": "Task not found."}), 404

        connection.execute(
            """
            UPDATE tasks
            SET completed = 1, completed_at = ?
            WHERE id = ?
            """,
            (now_iso(), task_id),
        )
        row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

    return jsonify(task_to_dict(row))


@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id):
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found."}), 404

    return "", 204


init_database()

if __name__ == "__main__":
    app.run(debug=True, port=5000)