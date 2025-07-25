import { roleBasedRoutes } from './path-to-your-file'; // Update this import to the correct file path

describe('roleBasedRoutes', () => {
    test('should have routes defined for "admin" role', () => {
        const adminRoutes = roleBasedRoutes.admin;

        // Check that routes exist for admin
        expect(adminRoutes).toBeDefined();
        expect(Array.isArray(adminRoutes)).toBe(true);

        // Check for specific routes
        expect(adminRoutes).toContainEqual({
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'dashboard-icon',
        });
        expect(adminRoutes).toContainEqual({
            name: 'Students',
            path: '/students',
            icon: 'students-icon',
        });
        expect(adminRoutes).toContainEqual({
            name: 'Teachers',
            path: '/teachers',
            icon: 'teachers-icon',
        });
    });

    test('should have routes defined for "student" role', () => {
        const studentRoutes = roleBasedRoutes.student;

        // Check that routes exist for student
        expect(studentRoutes).toBeDefined();
        expect(Array.isArray(studentRoutes)).toBe(true);

        // Check for specific routes
        expect(studentRoutes).toContainEqual({
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'dashboard-icon',
        });
        expect(studentRoutes).toContainEqual({
            name: 'My Classes',
            path: '/classes',
            icon: 'classes-icon',
        });
    });

    test('should have routes defined for "teacher" role', () => {
        const teacherRoutes = roleBasedRoutes.teacher;

        // Check that routes exist for teacher
        expect(teacherRoutes).toBeDefined();
        expect(Array.isArray(teacherRoutes)).toBe(true);

        // Check for specific routes
        expect(teacherRoutes).toContainEqual({
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'dashboard-icon',
        });
        expect(teacherRoutes).toContainEqual({
            name: 'My Classes',
            path: '/classes',
            icon: 'classes-icon',
        });
    });

    test('should not have undefined or empty roles', () => {
        expect(roleBasedRoutes.admin.length).toBeGreaterThan(0);
        expect(roleBasedRoutes.student.length).toBeGreaterThan(0);
        expect(roleBasedRoutes.teacher.length).toBeGreaterThan(0);
    });
});
