import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './UsersList.module.css';

interface User {
  username: string;
  role: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_URL || '';

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<User[]>(`${apiUrl}/admin/activities`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Fetched users:', response.data); 
      setUsers(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching users:', err.message);
      setError(err.message);
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles['users-list']}>
      {users.map((user, index) => (
        <div className={styles['user-item']} key={index}>
          <div className={styles['user-info']}>
            <span className={styles['username']}>{user.username}</span>
            <span className={styles['user-role']}>{user.role}</span>
          </div>
          <div className={styles['user-actions']}>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
