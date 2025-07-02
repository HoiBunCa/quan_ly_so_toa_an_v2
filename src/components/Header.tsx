import React from 'react';
import { Plus, UserPlus, LogOut } from 'lucide-react'; // Import LogOut icon
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook

interface HeaderProps {
  onCreateNewBook: () => void;
  onAddUser: () => void;
}

export default function Header({ onCreateNewBook, onAddUser }: HeaderProps) {
  const { logout } = useAuth(); // Use the logout function from auth context

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
      <div className="flex items-center space-x-3">
        <button
          onClick={onCreateNewBook}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Book</span>
        </button>
        <button
          onClick={onAddUser}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
        <button
          onClick={logout} // Call logout function on click
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}