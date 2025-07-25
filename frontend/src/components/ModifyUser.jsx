import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { useDispatch } from "react-redux";
import { decrement, increment } from "../reducers/adminCounter";
import DBContext from "../context/DBContext";
import { Button } from "@mui/material";

const ModifyUser = ({ user, setSelectedUser }) => {
    const { modifyManagedUser } = useContext(DBContext);
    const { sn, ...userData } = user;
    const [formData, setFormData] = useState(userData);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // redux dispatch
    const dispatch = useDispatch();

    const validate = () => {
        let tempErrors = {};
        tempErrors.username = formData.username ? "" : "Username is required.";
        tempErrors.email = formData.email ? "" : "Email is required.";
        tempErrors.fullName = formData.fullName ? "" : "Full Name is required.";
        tempErrors.phone = formData.phone
            ? formData.phone.length === 10
                ? ""
                : "Phone Number must be 10 digits long."
            : "Phone Number is required.";

        tempErrors.role =
            formData.role !== user.role
                ? `Role of ${user.role} cannot be changed to ${formData.role}.`
                : "";
        // Additional validations based on role
        if (formData.role === "student") {
            tempErrors.cls = formData.additionalInfo.cls
                ? ""
                : "Class ID is required.";
            tempErrors.sec = formData.additionalInfo.sec
                ? ""
                : "Section ID is required.";
        } else if (formData.role === "teacher") {
            tempErrors.subjects =
                formData.additionalInfo.subjects &&
                    formData.additionalInfo.subjects.length > 0
                    ? ""
                    : "At least one Subject ID is required.";
        }

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("form",formData);
        if (validate()) {
            modifyManagedUser(formData)
                .then((data) => {
                    console.log("Modified user: ",data);
                    setSelectedUser(null);
                    navigate("/users/manage-users", { replace: true });
                    dispatch(increment());
                })
                .catch((error) => {
                    console.error(
                        "There was an error modifying the user!",
                        error
                    );
                    dispatch(decrement());
                });
        }
    };

    return (
        <>
        <Button onClick={()=>{window.location.reload()}} style={{marginLeft: "5%"}}>
            <u>{"< Back"}</u>
        </Button>
        <UserForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
            disablePassword={true}
        />
        </>
    );
};

export default ModifyUser;
