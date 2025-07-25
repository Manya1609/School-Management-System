import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import SectionForm from "./SectionForm";

const AddSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        classId: "",
        userId: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { sectionsAPI } = useContext(DBContext);

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.classId = formData.classId ? "" : "Class is required.";
        tempErrors.userId = formData.userId ? "" : "Teacher is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };


    async function addSection(){
        try{
            let response = await sectionsAPI.post({postData: formData})
            console.log("Added section: ",response);
            navigate("sections/manage-sections");
        }
        catch(err){
            console.error("There was an error adding the Section!", err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addSection();
        }
    };

    return (
        <SectionForm formData={formData} setFormData={setFormData} errors={errors} handleSubmit={handleSubmit} />
    );
};

export default AddSection;