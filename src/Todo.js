import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/signin');
    } else {
      fetchTodos();
    }
  }, [navigate]);

  const fetchTodos = async () => {
    const token = localStorage.getItem('jwt');
    const response = await fetch('https://www.pre-onboarding-selection-task.shop/todos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);  
    if (Array.isArray(data)) {
      setTodos(data);
    } else {
      setTodos([]);
    }
  };
  

  const handleAddTodo = async () => {
    const token = localStorage.getItem('jwt');
    const response = await fetch('https://www.pre-onboarding-selection-task.shop/todos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo: newTodo }),
    });
    const data = await response.json();
    console.log(data); 
    setTodos([...todos, data]);
    setNewTodo('');
  };


  const handleToggleTodo = async (id) => {
    const token = localStorage.getItem('jwt');
    const todo = todos.find((todo) => todo.id === id);
    const response = await fetch(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo: todo.text, isCompleted: !todo.isCompleted }),
    });
    const data = await response.json();
    console.log(data); 
    setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
  };

  const handleModifyTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setEditingTodo(todo);
    setEditingText(todo.todo);
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`status: ${response.status}`); 
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`https://www.pre-onboarding-selection-task.shop/todos/${editingTodo.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo: editingText, isCompleted: editingTodo.isCompleted }),
    });
    const data = await response.json();
    console.log(data); 
    setTodos(todos.map((todo) => (todo.id === editingTodo.id ? data : todo)));
    setEditingTodo(null);
    setEditingText('');
  };

  const handleCancel = () => {
    setEditingTodo(null);
    setEditingText('');
  };

  return (
    <div>
      <input
        type="text"
        data-testid="new-todo-input"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button data-testid="new-todo-add-button" onClick={handleAddTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingTodo?.id === todo.id ? (
              <div>
                <input
                  type="text"
                  data-testid="modify-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button data-testid="submit-button" onClick={handleSubmit}>Submit</button>
                <button data-testid="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <span>{todo.todo}</span>
                </label>
                <button data-testid="modify-button" onClick={() => handleModifyTodo(todo.id)}>Modify</button>
                <button data-testid="delete-button" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
