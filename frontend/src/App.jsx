import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/todos/";

  // Get todos
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    const newTodo = await response.json();

    setTodos([newTodo, ...todos]);
    setTitle("");
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
    });

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle completed
  const toggleTodo = async (todo) => {
    const response = await fetch(`${API_URL}${todo.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    const updatedTodo = await response.json();

    setTodos(
      todos.map((item) =>
        item.id === updatedTodo.id ? updatedTodo : item
      )
    );
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>My Todo App</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Enter a todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">
          Add Todo
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo)}
              style={{
                textDecoration: todo.completed
                  ? "line-through"
                  : "none",
                cursor: "pointer",
                marginRight: "20px",
              }}
            >
              {todo.title}
            </span>

            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;