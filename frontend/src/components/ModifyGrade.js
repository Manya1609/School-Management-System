import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import GradeForm from "./GradeForm";

const ModifyGrade = ({ grade, setSelectedGrade }) => {
    const newGrade = {gradeName:grade.gradeName, gradeType: grade.gradeType, markFrom:'', markTo:'', gradeRemark: grade.gradeRemark}
    const [formData, setFormData] = useState(newGrade);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // const { updateGrade, setSelectedGrade } = useContext(UserContext);
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

    async function modifyGrade(){
        try{
            let id=grade.gradeId;
            const response = await gradesAPI.put({ putData: formData, id });
            console.log("Modified the grade", response)
            navigate("/exams/grades/manage-grades");
            setSelectedGrade(null);
        }
        catch(err){
            console.error(
                "There was an error modifying the Exam!",
                err
            );
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            modifyGrade();
        }
    };


    return (
        <GradeForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
};

export default ModifyGrade;