import { useEffect, useState } from 'react';
import axios from "axios";

function App() {
  const [input, setInput] = useState('');
  const [todo, setTodo] = useState([]);
  const [update, setUpdate] = useState(false);
  const [editId, setEditId] = useState(null); 

  const fetchTodo = async () => {
    try {
      const response = await axios.get('http://localhost:8000/todo');
      setTodo(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const addHandler = async () => {
    setInput('');
    try {
      await axios.post("http://localhost:8000/todo", { todo: input });
      fetchTodo();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/todo/${id}`);
      fetchTodo();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const edit = (item, id) => {
    setInput(item);
    setEditId(id); // Store the id of the todo being edited
    setUpdate(true);
  };

  const editHandler = async () => {
    try {
      await axios.put(`http://localhost:8000/todo/${editId}`, { todo: input });
      fetchTodo();
      setUpdate(false);
      setInput('');
      setEditId(null); // Reset the editId after editing
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  return (
    <div>
      <div>
        <input type="text" placeholder='Task here' value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={update ? editHandler : addHandler}>{update ? "Update" : "Add"}</button>
      </div>

      {todo.map(item => (
        <span key={item._id}>
          <p>{item.todo}</p>
          <button onClick={() => deleteHandler(item._id)}>delete</button>&nbsp;
          <button onClick={() => edit(item.todo, item._id)}>edit</button>
        </span>
      ))}
    </div>
  );
}

export default App;
