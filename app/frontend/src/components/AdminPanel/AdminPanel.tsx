import React from 'react';
import BooksTable from './BooksTable';
import UsersList from './UsersList';
import styles from './AdminPanel.module.css';

const AdminPanel: React.FC = () => {
  return (
    <div className={styles['admin-panel']}>
      <h2 className={styles['section-title']}>Admin Panel</h2>
      <div className={styles['content']}>
        <div className={styles['books-section']}>
          <h3>Books</h3>
          <BooksTable />
        </div>
        <div className={styles['users-section']}>
          <h3>Users</h3>
          <UsersList />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
