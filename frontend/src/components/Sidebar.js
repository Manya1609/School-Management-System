"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from "flowbite-react";
import { useAuth } from '../hooks/useAuth';
import {
  Face3TwoTone as StudentIcon,
  PushPinTwoTone as PinIcon,
  PortraitTwoTone as AccountIcon,
  HotelTwoTone as DormIcon,
  BookTwoTone as SubjectIcon,
  InsertPageBreakTwoTone as SectionIcon,
  AdminPanelSettingsTwoTone as AdminIcon,
  SchoolTwoTone as AcademicsIcon,
  Person2TwoTone as UserIcon,
  TaskTwoTone as TestIcon,
  MeetingRoomTwoTone as ClassIcon,
  Assignment as NoticeIcon,
  SpaceDashboardTwoTone as DashboardIcon,
} from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar } from "@adobe/react-spectrum"; // Import Avatar component from Adobe Spectrum

const buttonStyle =
  "font-semibold bg-gradient-to-tl from-blue-100 to-pink-100 bg-opacity-30 backdrop-blur-sm shadow-lg rounded-lg p-2 my-2 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-200 hover:to-pink-100 hover:transform hover:scale-105 transition-colors";
const subItemStyles =
  "border-l-[10px] border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 hover:bg-blue-100 hover:font-semibold transition-colors duration-300 ease-in-out";

// Define the visibility rules for each role
const visibilityRules = {
  super_admin: {
    dashboard: true,
    notices: true,
    academics: true,
    administrative: true,
    students: true,
    users: true,
    classes: true,
    dormitories: false,
    sections: true,
    subjects: true,
    exams: true,
    settings: true,
    pins: true,
    account: true,
  },
  admin: {
    dashboard: true,
    notices: true,
    academics: true,
    administrative: true,
    students: true,
    users: true,
    classes: true,
    dormitories: false,
    sections: true,
    subjects: true,
    exams: true,
    settings: true,
    pins: true,
    account: true,
  },
  teacher: {
    dashboard: true,
    notices: true,
    academics: true,
    administrative: false,
    students: true,
    users: false,
    classes: true,
    dormitories: false,
    sections: true,
    subjects: true,
    exams: true,
    settings: true,
    pins: true,
    account: true,
  },
  student: {
    dashboard: true,
    notices: true,
    academics: true,
    administrative: false,
    students: false,
    users: false,
    classes: true,
    dormitories: false,
    sections: true,
    subjects: true,
    exams: true,
    settings: false,
    pins: true,
    account: true,
  },
};

const SidebarComponent = () => {
  const { user } = useAuth();  // Include logout function from useAuth
  const currentUser = user ?? {
    name: 'Ayush',
    role: 'admin',
    id: '1'
  };// Default to admin if user is null, just to debug, later change to student
  const role = currentUser.role;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMenuItemText = (fullText, shortText) => {
    if (screenWidth < 600) {
      return '';
    } else if (screenWidth < 850) {
      return shortText;
    } else {
      return fullText;
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-100 to-purple-100">
      <Sidebar aria-label="Sidebar" className="bg-white bg-opacity-30 backdrop-blur-md shadow-lg">
        <div className="hidden md:flex items-center p-4 border-b border-gray-200">
          <Avatar
            src="https://i.imgur.com/kJOwAdv.png" // Replace with the actual profile image URL
            alt="Profile Picture"
            size="avatar-size-700" // Increased size for the avatar
          />
          <div className="ml-3 flex-grow">
            <div className="text-xl font-semibold">{currentUser.fullName}</div>
            <div className="text-base font-semibold text-gray-500">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
          </div>
          <a href="/settings">
            <SettingsIcon
              className="text-gray-500 cursor-pointer hover:text-gray-700 ml-2"
              style={{ fontSize: 30 }} 
            />
          </a>
        </div>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {visibilityRules[role].dashboard && (
              <Sidebar.Item href="/dashboard" icon={DashboardIcon} className={buttonStyle}>
                {getMenuItemText('Dashboard', 'Dash')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].notices && (
              <Sidebar.Item href="/notices" icon={NoticeIcon} className={buttonStyle}>
                {getMenuItemText('Notices', 'Notices')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].academics && (
              <Sidebar.Collapse icon={AcademicsIcon} label={getMenuItemText('Academics', 'Acad')} className={buttonStyle}>
                <Sidebar.Item href="/academics/timetable" className={subItemStyles}>Time Table</Sidebar.Item>
              </Sidebar.Collapse>
            )}
            {/* {visibilityRules[role].administrative && (
              <Sidebar.Collapse icon={AdminIcon} label={getMenuItemText('Administrative', 'Admin')} className={buttonStyle}>
                <Sidebar.Item href="/administrative" className={subItemStyles}>Admin Home</Sidebar.Item>
              </Sidebar.Collapse>
            )} */}
            {visibilityRules[role].students && (
              <Sidebar.Collapse icon={StudentIcon} label={getMenuItemText('Students', 'Stud')} className={buttonStyle}>
                <Sidebar.Item href="/student-info" className={subItemStyles}>Student Information</Sidebar.Item>
                <Sidebar.Item href="/promote-students" className={subItemStyles}>Student Promotion</Sidebar.Item>
              </Sidebar.Collapse>
            )}
            {visibilityRules[role].users && (
              <Sidebar.Item href="/users" icon={UserIcon} className={buttonStyle}>
                {getMenuItemText('Users', 'Users')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].classes && (
              <Sidebar.Item href="/classes" icon={ClassIcon} className={buttonStyle}>
                {getMenuItemText('Classes', 'Classes')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].dormitories && (
              <Sidebar.Item href="/dormitories" icon={DormIcon} className={buttonStyle}>
                {getMenuItemText('Dormitories', 'Dorms')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].sections && (
              <Sidebar.Item href="/sections" icon={SectionIcon} className={buttonStyle}>
                {getMenuItemText('Sections', 'Secs')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].subjects && (
              <Sidebar.Item href="/subjects" icon={SubjectIcon} className={buttonStyle}>
                {getMenuItemText('Subjects', 'Subj')}
              </Sidebar.Item>
            )}
            {visibilityRules[role].exams && (
              <Sidebar.Collapse icon={TestIcon} label={getMenuItemText('Exams', 'Exams')} className={buttonStyle}>
                <Sidebar.Item href="/exams/exam-list" className={subItemStyles}>Exam List</Sidebar.Item>
                <Sidebar.Item href="/exams/grades" className={subItemStyles}>Grades</Sidebar.Item>
                <Sidebar.Item href="/exams/tabulation-sheet" className={subItemStyles}>Marksheet Tabulation</Sidebar.Item>
                <Sidebar.Item href="/exams/manage-marks" className={subItemStyles}>Marks</Sidebar.Item>
              </Sidebar.Collapse>
            )}
            {visibilityRules[role].settings && (
              <Sidebar.Item href="/settings" icon={SettingsIcon} className={buttonStyle}>
                {getMenuItemText('Settings', 'Settings')}
              </Sidebar.Item>
            )}
            {false && visibilityRules[role].pins && (
              <Sidebar.Collapse icon={PinIcon} label={getMenuItemText('Pins', 'Pins')} className={buttonStyle}>
                <Sidebar.Item href="/pins" className={subItemStyles}>Home</Sidebar.Item>
              </Sidebar.Collapse>
            )}
            {visibilityRules[role].account && (
              <Sidebar.Item href="/my-profile" icon={AccountIcon} className={buttonStyle}>
                {getMenuItemText('My Profile', 'Profile')}
              </Sidebar.Item>
            )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;