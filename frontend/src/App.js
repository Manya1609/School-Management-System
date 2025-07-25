"use client";

import React, { lazy, useState, useEffect, Suspense } from 'react';
import { Provider, lightTheme } from '@adobe/react-spectrum';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import CustomSuspense from './components/CustomSuspense';
import { Progress } from "flowbite-react"; // Import the Progress component
import { DBProvider } from './context/DBContext';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));
const StudentInformation = lazy(() => import('./pages/StudentInformation'));
const ManageClasses = lazy(() => import('./pages/ManageClasses'));
const ManageSections = lazy(() => import('./pages/ManageSections'));
const ManageSubjects = lazy(() => import('./pages/ManageSubjects'));
const ManageTimetables = lazy(() => import('./pages/ManageTimetables'));
const ManageSlots = lazy(() => import('./pages/ManageSlots'));
const AssignSlots = lazy(() => import('./pages/AssignSlots'));
const SingleTimetable = lazy(() => import('./pages/SingleTimetable'));
const ManageGrades = lazy(() => import('./pages/ManageGrades'));
const ManageExamList = lazy(() => import('./pages/ManageExamList'));
const SingleNotice = lazy(() => import('./pages/SingleNotice'));
const ManageNotices = lazy(() => import('./pages/ManageNotices'));
const Settings = lazy(() => import('./pages/Settings'));
const PromoteStudents = lazy(() => import('./pages/PromoteStudents'));
const ManageSystemSettings = lazy(() => import('./pages/ManageSystemSettings'));
const ManageMarks = lazy(() => import('./pages/ManageMarks'));
const TabulationSheet = lazy(() => import('./pages/TabulationSheet'));

const App = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // Show loader for at least 1 second
        const progressInterval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
        }, 100); // Update progress every 100ms

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <Provider theme={lightTheme} colorScheme="light">
            <AuthProvider>
                <DBProvider>
                    <Router>
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="w-1/3">
                                    <Progress progress={progress} size="lg" color="dark" />
                                </div>
                            </div>
                        }>
                            {loading ? (
                                <div className="flex items-center justify-center h-screen">
                                    <div className="w-1/3">
                                        <Progress progress={progress} size="lg" color="dark" />
                                    </div>
                                </div>
                            ) : (
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/ForgotPassword" element={<ForgotPassword />} />
                                    <Route path="/" element={<MainLayout />}>
                                        <Route path="dashboard" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><Dashboard /></CustomSuspense>} />} />
                                        <Route path="users" element={<PrivateRoute roles={['super_admin', 'admin']} element={<Navigate to="./create-new-user" />} />} />
                                        <Route path="users/*" element={<PrivateRoute roles={['super_admin', 'admin']} element={<CustomSuspense><ManageUsers /></CustomSuspense>} />} />
                                        <Route path="student-info" element={<PrivateRoute roles={['super_admin', 'teacher', 'admin']} element={<CustomSuspense><StudentInformation /></CustomSuspense>} />} />
                                        <Route path="classes" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="./create-new-class" />} />} />
                                        <Route path="classes/*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><ManageClasses /></CustomSuspense>} />} />
                                        <Route path="sections" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="./create-new-section" />} />} />
                                        <Route path="sections/*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><ManageSections /></CustomSuspense>} />} />
                                        <Route path="subjects" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="./add-subject" />} />} />
                                        <Route path="subjects/*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><ManageSubjects /></CustomSuspense>} />} />
                                        <Route path="academics/timetable" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="./create-new-timetable" />} />} />
                                        <Route path="academics/timetable/my" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><SingleTimetable my/></CustomSuspense>} />} />
                                        <Route path="academics/timetable/view/:ttid" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><SingleTimetable /></CustomSuspense>} />} />
                                        <Route path="academics/timetable/assign/:ttid" element={<PrivateRoute roles={['super_admin', 'admin']} element={<CustomSuspense><AssignSlots /></CustomSuspense>} />} />
                                        <Route path="academics/timetable/*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><ManageTimetables /></CustomSuspense>} />} />
                                        <Route path="slots" element={<PrivateRoute roles={['super_admin', 'admin']} element={<Navigate to={`./create-new-slots`} />} />} />
                                        <Route path="slots/*" element={<PrivateRoute roles={['super_admin', 'admin']} element={<CustomSuspense><ManageSlots /></CustomSuspense>} />} />
                                        <Route path="exams/grades" element={<PrivateRoute roles={['super_admin', 'admin']} element={<Navigate to="./add-new-grade" />} />} />
                                        <Route path="exams/grades/*" element={<PrivateRoute roles={['super_admin', 'admin']} element={<CustomSuspense><ManageGrades /></CustomSuspense>} />} />
                                        <Route path="exams/exam-list" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="./add-new-exam" />} />} />
                                        <Route path="exams/exam-list/*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><ManageExamList /></CustomSuspense>} />} />
                                        <Route path="exams/manage-marks" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<ManageMarks />} />} />
                                        <Route path="exams/tabulation-sheet" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<TabulationSheet />} />} />
                                        <Route path="notices" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="./create-new-notice" />} />} />
                                        <Route path="notices/view/:id" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><SingleNotice /></CustomSuspense>} />} />
                                        <Route path="notices/*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><ManageNotices /></CustomSuspense>} />} />
                                        <Route path="settings" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><Settings /></CustomSuspense>} />} />
                                        <Route path="promote-students" element={<PrivateRoute roles={['super_admin', 'teacher', 'admin']} element={<CustomSuspense><PromoteStudents /></CustomSuspense>} />} />
                                        <Route path="manage-system-settings" element={<PrivateRoute roles={['super_admin', 'admin']} element={<CustomSuspense><ManageSystemSettings /></CustomSuspense>} />} />
                                        <Route path="my-profile" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<CustomSuspense><UserProfile /></CustomSuspense>} />} />
                                        <Route path="user-profile/:id" element={<PrivateRoute roles={['super_admin', 'admin']} element={<CustomSuspense><UserProfile /></CustomSuspense>} />} />
                                        <Route path="*" element={<PrivateRoute roles={['super_admin', 'student', 'teacher', 'admin']} element={<Navigate to="/dashboard" />} />} />
                                    </Route>
                                </Routes>
                            )}
                        </Suspense>
                    </Router>
                </DBProvider>
            </AuthProvider>
        </Provider>
    );
};

export default App;
