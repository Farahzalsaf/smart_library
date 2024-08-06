import React from 'react';
import BooksTable from './BooksTable';
import UsersList from './UsersList';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  return (
    <div className={styles['admin-panel']}>
      <div className={styles['content']}>
        <h2 className={styles['section-title']}>Admin Panel</h2>
        <div className={styles['books-section']}>
          <h3 className={styles['subsection-title']}>Books</h3>
          <div className={styles['books-table-container']}> 
            <BooksTable />
          </div>
        </div>
        <div className={styles['users-section']}>
          <h3 className={styles['subsection-title']}>Users</h3>
          <UsersList />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
