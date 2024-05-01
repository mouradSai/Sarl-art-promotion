import React, { useState } from 'react';
import './users.css';

function users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
  ]);

  const [newUser, setNewUser] = useState({ id: '', name: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, newUser]);
    setNewUser({ id: '', name: '', email: '' });
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <div className="user-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        <button onClick={addUser}>Add User</button>
      </div>
      <div className="user-list">
        <h2>User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default users;


