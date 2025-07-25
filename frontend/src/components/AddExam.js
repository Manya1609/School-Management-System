import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import ExamForm from "./ExamForm";

const AddExam = () => {
    const [formData, setFormData] = useState({
        name: "",
        term: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { examsAPI } = useContext(DBContext);

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.term = formData.term ? "" : "Term is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };


    async function addExam(){
        try{
            let response = await examsAPI.post({postData: formData})
            console.log("Added exam: ",response);
            navigate("/exams/exam-list/manage-exams");
        }
        catch(err){
            console.error("There was an error adding the Exam!", err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addExam();
        }
    };


    return (
        <ExamForm formData={formData} setFormData={setFormData} errors={errors} handleSubmit={handleSubmit} />
    );
};

export default AddExam;