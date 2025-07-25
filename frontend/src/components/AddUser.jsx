import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { useDispatch } from "react-redux";
import { decrement, increment } from "../reducers/adminCounter";
import DBContext from "../context/DBContext";

const AddUser = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "admin", // Default value is "admin"
        email: "",
        fullName: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        additionalInfo: {},
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { addManagedUser } = useContext(DBContext);

    // redux dispatch
    const dispatch = useDispatch();

    const validate = () => {
        let tempErrors = {};
        tempErrors.username = formData.username ? "" : "Username is required.";
        tempErrors.password = formData.password ? "" : "Password is required.";
        tempErrors.email = formData.email ? "" : "Email is required.";
        tempErrors.fullName = formData.fullName ? "" : "Full Name is required.";
        tempErrors.phone = formData.phone
            ? formData.phone.length === 10
                ? ""
                : "Phone Number must be 10 digits long."
            : "Phone Number is required.";
        tempErrors.cls = (
            formData.additionalInfo.hasOwnProperty("cls") 
            && formData.additionalInfo.cls==null
        ) ? "Class is required." : "";
        tempErrors.sec = (
            formData.additionalInfo.hasOwnProperty("sec") 
            && formData.additionalInfo.sec==null
        ) ? "Section is required." : "";
        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("form",formData);
        if (validate()) {
            addManagedUser(formData)
                .then((data) => {
                    console.log("Added user: ",data);
                    navigate("/users/manage-users");
                    dispatch(increment());
                })
                .catch((error) => {
                    console.error("There was an error adding the user!", error);
                    dispatch(decrement());
                });
        }
    };

    return (
        <UserForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
};

export default AddUser;
