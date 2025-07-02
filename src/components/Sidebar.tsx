import {
  BookOpen, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Scale,
  Users, // Import Users icon
  LogOut // Import LogOut icon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { icon: BookOpen, label: 'Án hôn nhân', page: 'case-books' },
  // { icon: BookOpen, label: 'Án Hình sự', page: 'case-books' },
  { icon: Users, label: 'Quản lý người dùng', page: 'user-management' }, // New menu item
  { icon: BarChart3, label: 'Báo cáo', page: 'reports' },
  { icon: Settings, label: 'Cài đặt', page: 'settings' },
];

export default function Sidebar({ isCollapsed, onToggle, currentPage, onPageChange }: SidebarProps) {
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Quản lý sổ án</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-5 h-5 text-gray-500 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onPageChange(item.page)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors group ${
                  currentPage === item.page
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                aria-label={item.label}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                  currentPage === item.page ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile and Logout */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-4`}>
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" // Placeholder avatar
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role}
                </p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          } text-gray-700 hover:bg-red-50 hover:text-red-600`}
          aria-label="Đăng xuất"
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} text-gray-500 group-hover:text-red-600`} />
          {!isCollapsed && (
            <span className="font-medium">Đăng xuất</span>
          )}
        </button>
      </div>
    </div>
  );
}