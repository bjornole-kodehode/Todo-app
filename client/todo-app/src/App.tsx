import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

type Todos = {
  name: string;
  id: number;
};

function App() {
  const [todosItems, setTodosItems] = useState<Todos[]>([]);
  const [postTodoItem, setPostToItem] = useState("");
  const [selectedTodoItemId, setSelectedTodoItemId] = useState<null | number>(
    null
  );
  useEffect(() => {
    async function getItems() {
      const response = await axios.get("http://localhost:5117/api/todoitems");
      setTodosItems(response.data);
    }
    getItems();
  }, []);
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postTodoItem.trim()) {
      return;
    }
    const newTodoItem = { name: postTodoItem };
    const response = await axios.post(
      "http://localhost:5117/api/todoitems",
      newTodoItem
    );

    setTodosItems([...todosItems, response.data]);
    setPostToItem("");
  }

  async function deleteTodoItem(id: number) {
    await axios.delete(`http://localhost:5117/api/todoitems/${id}`);
    setTodosItems(todosItems.filter((todo) => todo.id !== id));
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          value={postTodoItem}
          type="text"
          onChange={(e) => setPostToItem(e.target.value)}
          required
          placeholder="Enter todo"
        />
        <button type="submit">Add todo</button>
      </form>
      {todosItems
        .sort((a, b) => b.id - a.id)
        .map((todo) => {
          const isSelected = selectedTodoItemId === todo.id;
          return (
            <div
              key={todo.id}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <p
                style={{
                  width: "50px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {todo.name}
              </p>
              <button
                onClick={() =>
                  setSelectedTodoItemId(isSelected ? null : todo.id)
                }
                style={{ border: "none", background: "none", color: "#3b82f6" }}
              >
                Show more
              </button>
              <button
                style={{ backgroundColor: "#ef4444", color: "white" }}
                onClick={() => deleteTodoItem(todo.id)}
              >
                X
              </button>

              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "#bae6fd",
                    width: "500px",
                    height: "300px",
                    zIndex: 999999999,
                  }}
                >
                  <p>{todo.name}</p>
                  <button
                    onClick={() =>
                      setSelectedTodoItemId(isSelected ? null : todo.id)
                    }
                    style={{
                      border: "none",
                      background: "none",
                      color: "#3b82f6",
                    }}
                  >
                    Show less
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}

export default App;
