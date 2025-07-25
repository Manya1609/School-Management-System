import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import ClassForm from "./ClassForm";

const ModifyClass = ({ clazz, setSelectedClass }) => {
    const {sn,...newClazz} = clazz
    const [formData, setFormData] = useState(newClazz);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // const { updateClass, setSelectedClass } = useContext(UserContext);
    const { classesAPI } = useContext(DBContext);


    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.classType = formData.classType ? "" : "Class Type is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    async function modifyClass(){
        try{
            let id=clazz.id;
            const response = await classesAPI.put({ putData: formData, id });
            console.log("Modified the class", response)
            navigate("/classes/manage-classes")
            setSelectedClass(null)
        }
        catch(err){
            console.error("There was an error modifying the class details", err)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            modifyClass();
        }
    };

    return (
        <ClassForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
};

export default ModifyClass;