"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from '../assets/logo.jpg';
import DBContext from '../context/DBContext';
import { useNavigate } from 'react-router-dom';

const Component = () => {
  const { systemAPI } = useContext(DBContext);
  const { user, logout } = useAuth();  // Include logout function from useAuth
  const currentUser = user;
  const [sysDetails, setSysDetails] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    user && systemAPI.get()
      .then(({nameOfSchool,schoolAcronym})=>setSysDetails({nameOfSchool,schoolAcronym}))
      .catch(err=>{
        const {pathname} = window.location;
        console.log(pathname, err);
        if(err.status===403){
          logout();
        }else if(user.role==='super_admin' && !pathname.includes("manage-system-settings")){
          navigate("/manage-system-settings?setup=true",{replace: true});
        }
      })

    if(!user){
      navigate("/login")
    }
  },[user,logout,systemAPI,navigate]);

  // console.log(user ?? "NO USER FOUND!");
  if(!user) return <div>Loading...</div>;
  return (
    <Navbar fluid rounded className='border-b-2 border-red-300'>
      <Navbar.Brand href="http://localhost:3000/dashboard">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="School Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          <span className="hidden sm:inline">{sysDetails.nameOfSchool ?? "..."}</span>
          <span className="inline sm:hidden">{sysDetails.schoolAcronym ?? "..."}</span>
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://i.imgur.com/kJOwAdv.png" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-md">{currentUser.fullName}</span>
            <span className="block truncate text-sm font-medium">{currentUser.role}</span>
          </Dropdown.Header>
          <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item> {/* Set the sign-out button to call logout */}
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Component;