import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import SubjectForm from "./SubjectForm";

const ModifySubject = ({ subject, setSelectedSubject }) => {
    const subjectRequestDTO = {subjectName: subject.subjectName, shortName: subject.shortName, classId:'', userId: ''}
    const [formData, setFormData] = useState(subjectRequestDTO);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // const { updateSubject, setSelectedSubject } = useContext(UserContext);
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

    async function modifySubject(){
        try{
            let id=subject.subjectId;
            const response = await subjectsAPI.put({ putData: formData, id });
            console.log("Modified the subject", response)
            navigate("/subjects/manage-subjects");
            setSelectedSubject(null);
        }
        catch(err){
            console.error(
                "There was an error modifying the Subject!",
                err
            );
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            modifySubject();
        }
    };

    return (
        <SubjectForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
};

export default ModifySubject;