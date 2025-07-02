import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CaseBooks from './CaseBooks';
import CaseManagement from './CaseManagement';
import UserManagement from './UserManagement';
import CreateBookModal from './CreateBookModal';
import UserFormModal from './UserFormModal';
import { CaseBook } from '../types/caseTypes';
import { mockUsers } from '../data/mockData';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState<CaseBook | null>(null);

  // State for Case Books refresh
  const [caseBooksRefreshKey, setCaseBooksRefreshKey] = useState(0); // New state to trigger refresh
  const [showCreateBookModal, setShowCreateBookModal] = useState(false);

  // State for User Management
  const [users, setUsers] = useState(mockUsers);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null);

  const { user } = useAuth(); // Get user from AuthContext

  const handleBookCreated = () => { // Renamed from handleCreateBook
    setCaseBooksRefreshKey(prev => prev + 1); // Increment to trigger refresh in CaseBooks
    setShowCreateBookModal(false); // Close modal
  };

  const handleSaveUser = (user: typeof mockUsers[0]) => {
    if (editingUser) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      const newUser = { ...user, id: `user-${Date.now()}` };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const renderPageContent = () => {
    if (selectedBook) {
      return (
        <CaseManagement 
          book={selectedBook} 
          onBack={() => setSelectedBook(null)} 
        />
      );
    }

    switch (currentPage) {
      case 'case-books':
        return (
          <CaseBooks 
            onSelectBook={setSelectedBook} 
            setShowCreateModal={setShowCreateBookModal} 
            refreshTrigger={caseBooksRefreshKey} // Pass the refresh key
          />
        );
      case 'user-management':
        return (
          <UserManagement 
            users={users} 
            setUsers={setUsers} 
            setShowModal={setShowUserModal} 
            setEditingUser={setEditingUser} 
            handleDeleteUser={handleDeleteUser}
          />
        );
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports</h1>
            <p className="text-gray-600">Reports page content will be implemented here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-gray-600">Settings page content will be implemented here.</p>
          </div>
        );
      default:
        return (
          <CaseBooks 
            onSelectBook={setSelectedBook} 
            setShowCreateModal={setShowCreateBookModal} 
            refreshTrigger={caseBooksRefreshKey} 
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setSelectedBook(null);
        }}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onCreateNewBook={() => setShowCreateBookModal(true)}
          onAddUser={() => {
            setEditingUser(null);
            setShowUserModal(true);
          }}
        />
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {renderPageContent()}
        </div>
      </div>

      {/* Modals */}
      {showCreateBookModal && (
        <CreateBookModal
          onClose={() => setShowCreateBookModal(false)}
          onBookCreated={handleBookCreated} // Pass the new handler
        />
      )}

      {showUserModal && (
        <UserFormModal
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
          initialUser={editingUser}
        />
      )}
    </div>
  );
}