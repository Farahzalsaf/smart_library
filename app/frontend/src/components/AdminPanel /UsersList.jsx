import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersList.module.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/activities', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Fetched users:', response.data); 
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="users-list">
      {users.map((user, index) => (
        <div className="user-item" key={index}>
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <div className="user-actions">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
