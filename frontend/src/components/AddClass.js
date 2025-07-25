import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import ClassForm from "./ClassForm";

const AddClass = () => {
    const [formData, setFormData] = useState({
        name: "",
        classType: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { classesAPI } = useContext(DBContext);

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.classType = formData.classType ? "" : "Class Type is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    async function addClass(){
        try{
            let response = await classesAPI.post({postData: formData})
            console.log("Added class: ",response);
            navigate("/classes/manage-classes");
        }
        catch(err){
            console.error("There was an error while adding the class!", err)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addClass()
        }
    };

    return (
        <ClassForm formData={formData} setFormData={setFormData} errors={errors} handleSubmit={handleSubmit}/>
    );
};

export default AddClass;