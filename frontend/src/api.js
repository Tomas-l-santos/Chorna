const API_URL = 'http://localhost:5000/api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Something went wrong.'
    try {
      const errorData = await response.json()
      message = errorData.error || errorData.errors?.join(' ') || message
    } catch {
      // The response did not contain JSON, so the default message is used.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getTasks() {
  return request('/tasks')
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTask(id, task) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  })
}

export function completeTask(id) {
  return request(`/tasks/${id}/complete`, {
    method: 'PATCH',
  })
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  })
}