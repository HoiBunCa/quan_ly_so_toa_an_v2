export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'event';
}

// Removed currentUser as it will be managed by AuthContext

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    role: 'Court Administrator'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    role: 'Case Manager'
  },
  {
    id: '3',
    name: 'Alice Smith',
    email: 'alice.smith@company.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    role: 'Legal Assistant'
  },
  {
    id: '4',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    role: 'Judge'
  },
  {
    id: '5',
    name: 'Emily White',
    email: 'emily.white@company.com',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    role: 'Clerk'
  }
];

export const summaryStats = [
  {
    title: 'Total Users',
    value: '2,345',
    change: '+12%',
    trend: 'up' as const,
    icon: 'users'
  },
  {
    title: 'Active Projects',
    value: '18',
    change: '+3',
    trend: 'up' as const,
    icon: 'briefcase'
  },
  {
    title: 'Revenue',
    value: '$124.5K',
    change: '+8.2%',
    trend: 'up' as const,
    icon: 'dollar-sign'
  },
  {
    title: 'Tasks Completed',
    value: '847',
    change: '-2%',
    trend: 'down' as const,
    icon: 'check-circle'
  }
];

export const recentActivities: Activity[] = [
  {
    id: '1',
    user: 'John Doe',
    action: 'completed task',
    target: 'Website Redesign',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: '2',
    user: 'Alice Smith',
    action: 'created project',
    target: 'Mobile App Development',
    timestamp: '15 minutes ago',
    status: 'success'
  },
  {
    id: '3',
    user: 'Bob Wilson',
    action: 'missed deadline',
    target: 'API Documentation',
    timestamp: '1 hour ago',
    status: 'error'
  },
  {
    id: '4',
    user: 'Emma Davis',
    action: 'updated status',
    target: 'Database Migration',
    timestamp: '2 hours ago',
    status: 'warning'
  },
  {
    id: '5',
    user: 'Mike Chen',
    action: 'assigned task',
    target: 'Security Audit',
    timestamp: '3 hours ago',
    status: 'success'
  }
];

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Update user dashboard',
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Today',
    assignee: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'Review security protocols',
    status: 'pending',
    priority: 'medium',
    dueDate: 'Tomorrow',
    assignee: 'Mike Chen'
  },
  {
    id: '3',
    title: 'Client presentation prep',
    status: 'completed',
    priority: 'high',
    dueDate: 'Yesterday',
    assignee: 'Alice Smith'
  },
  {
    id: '4',
    title: 'Database optimization',
    status: 'pending',
    priority: 'low',
    dueDate: 'Next week',
    assignee: 'Bob Wilson'
  }
];

export const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: 'Today',
    time: '9:00 AM',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Project Deadline',
    date: 'Tomorrow',
    time: '5:00 PM',
    type: 'deadline'
  },
  {
    id: '3',
    title: 'Client Review',
    date: 'Friday',
    time: '2:00 PM',
    type: 'meeting'
  },
  {
    id: '4',
    title: 'Company Event',
    date: 'Next Monday',
    time: '6:00 PM',
    type: 'event'
  }
];