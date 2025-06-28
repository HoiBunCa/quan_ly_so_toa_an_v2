import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CaseBooks from './CaseBooks';
import CaseManagement from './CaseManagement';
import UserManagement from './UserManagement'; // Import the new component
import { CaseBook } from '../types/caseTypes';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState<CaseBook | null>(null);

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
        return <CaseBooks onSelectBook={setSelectedBook} />;
      case 'user-management': // New case for user management
        return <UserManagement />;
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
        return <CaseBooks onSelectBook={setSelectedBook} />;
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
        <Header />
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
}