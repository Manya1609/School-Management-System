import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import SubjectForm from "./SubjectForm";

const AddSubject = () => {
    const [formData, setFormData] = useState({
        subjectName: "",
        shortName: "",
        classId: "",
        userId:"",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { subjectsAPI } = useContext(DBContext);

    const validate = () => {
        let tempErrors = {};
        tempErrors.subjectName = formData.subjectName ? "" : "Name is required.";
        tempErrors.shortName = formData.shortName ? "" : "Short Name is required.";
        tempErrors.classId = formData.classId ? "" : "Class is required.";
        tempErrors.userId = formData.userId ? "" : "Teacher is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    async function addSubject(){
        try{
            let response = await subjectsAPI.post({postData: formData})
            console.log("Added subject: ",response);
            navigate("subjects/manage-subjects");
        }
        catch(err){
            console.error("There was an error adding the Subject!", err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addSubject();
        }
    };


    return (
        <SubjectForm formData={formData} setFormData={setFormData} errors={errors} handleSubmit={handleSubmit} />
    );
};

export default AddSubject;