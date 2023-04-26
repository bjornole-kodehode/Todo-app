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
        />
        <button type="submit">Add todo</button>
      </form>
      {todosItems
        .sort((a, b) => b.id - a.id)
        .map((todo) => {
          return (
            <div
              key={todo.id}
              style={{ display: "flex", alignItems: "center", gap: "20px" }}
            >
              <p>{todo.name}</p>
              <button onClick={() => deleteTodoItem(todo.id)}>X</button>
            </div>
          );
        })}
    </>
  );
}

export default App;
