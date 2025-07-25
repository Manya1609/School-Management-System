import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import ExamForm from "./ExamForm";

const ModifyExam = ({ exam, setSelectedExam }) => {
    const {sn, ...newExam} = exam
    const [formData, setFormData] = useState(newExam);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // const { updateExam, setSelectedExam } = useContext(UserContext);
    const { examsAPI } = useContext(DBContext);


    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.term = formData.term ? "" : "Term is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    async function modifyExam(){
        try{
            let id=exam.id;
            const response = await examsAPI.put({ putData: formData, id });
            console.log("Modified the exam", response)
            navigate("/exams/exam-list/manage-exams");
            setSelectedExam(null);
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
            modifyExam();
        }
    };

    return (
        <ExamForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
};

export default ModifyExam;