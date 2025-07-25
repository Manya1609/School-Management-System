import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import GradeForm from "./GradeForm";

const AddGrade = () => {
    const [formData, setFormData] = useState({
        gradeName: "",
        gradeType: "",
        markFrom: "",
        markTo:"",
        gradeRemark:""
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { gradesAPI } = useContext(DBContext);


    const validate = () => {
        let tempErrors = {};
        tempErrors.gradeName = formData.gradeName ? "" : "Name is required.";
        tempErrors.markFrom = formData.markFrom ? "" : "Starting Range of marks is required.";
        tempErrors.markTo = formData.markTo ? "" : "Ending Range of marks is required.";
        tempErrors.gradeRemark = formData.gradeRemark ? "" : "Remarks is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    async function addGrade(){
        try{
            let response = await gradesAPI.post({postData: formData})
            console.log("Added grade: ",response);
            navigate("exams/grades/manage-grades");
        }
        catch(err){
            console.error("There was an error adding the Exam!", err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addGrade();
        }
    };

    return (
        <GradeForm formData={formData} setFormData={setFormData} errors={errors} handleSubmit={handleSubmit} />
    );
};

export default AddGrade;