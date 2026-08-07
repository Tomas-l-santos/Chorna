import tempfile
import unittest
from pathlib import Path

import app as task_app


class TaskApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_directory = tempfile.TemporaryDirectory()
        task_app.DATABASE_PATH = Path(self.temp_directory.name) / "test.db"
        task_app.init_database()
        task_app.app.config["TESTING"] = True
        self.client = task_app.app.test_client()

    def tearDown(self):
        self.temp_directory.cleanup()

    def test_task_lifecycle(self):
        response = self.client.post(
            "/api/tasks",
            json={
                "title": "Build portfolio task manager",
                "description": "Finish the React interface",
                "dueDate": "2026-08-10",
                "priority": "High",
                "category": "Development",
            },
        )
        self.assertEqual(response.status_code, 201)
        task = response.get_json()

        response = self.client.put(
            f"/api/tasks/{task['id']}",
            json={
                "title": "Polish portfolio task manager",
                "description": "Improve the final interface",
                "dueDate": "2026-08-11",
                "priority": "Medium",
                "category": "Development",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["title"], "Polish portfolio task manager")

        response = self.client.patch(f"/api/tasks/{task['id']}/complete")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["completed"])

        response = self.client.delete(f"/api/tasks/{task['id']}")
        self.assertEqual(response.status_code, 204)

        response = self.client.get("/api/tasks")
        self.assertEqual(response.get_json(), [])


if __name__ == "__main__":
    unittest.main()