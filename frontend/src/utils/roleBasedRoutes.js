export const roleBasedRoutes = {
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
      { name: 'Students', path: '/students', icon: 'students-icon' },
      { name: 'Teachers', path: '/teachers', icon: 'teachers-icon' },
      // Add other routes for admin
    ],
    student: [
      { name: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
      { name: 'My Classes', path: '/classes', icon: 'classes-icon' },
      // Add other routes for students
    ],
    teacher: [
      { name: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
      { name: 'My Classes', path: '/classes', icon: 'classes-icon' },
      // Add other routes for teachers
    ],
  };
  