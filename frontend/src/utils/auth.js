export const loginUser = async (username, password) => {
    // Replace with API call for authentication
    const mockUsers = {
      admin: { name: 'Admin User', role: 'admin', avatar: '/admin-avatar.png' },
      student: { name: 'Student User', role: 'student', avatar: '/student-avatar.png' },
      teacher: { name: 'Teacher User', role: 'teacher', avatar: '/teacher-avatar.png' },
    };
    if (mockUsers[username] && password === 'password') {
      return mockUsers[username];
    }
    return null;
  };
  
  export const logoutUser = () => {
    // Handle logout (e.g., clearing tokens, etc.)
  };
  
// Not used anywhere