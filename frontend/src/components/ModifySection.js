import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import SectionForm from "./SectionForm";

const ModifySection = ({ section, setSelectedSection }) => {
    const sectionRequestDTO = {name: section.name, classId:'', userId:''}
    const [formData, setFormData] = useState(sectionRequestDTO);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // const { updateSection, setSelectedSection } = useContext(UserContext);
    const { sectionsAPI } = useContext(DBContext);


    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.classId = formData.classId ? "" : "Class is required.";
        tempErrors.userId = formData.userId ? "" : "Teacher is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    async function modifySection(){
        try{
            let id=section.id;
            console.log(formData)
            const response = await sectionsAPI.put({ putData: formData, id });
            console.log("Modified the section", response)
            navigate("/sections/manage-sections");
            setSelectedSection(null);
        }
        catch(err){
            console.error(
                "There was an error modifying the Section!",
                err
            );
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            modifySection();
        }
    };

    return (
        <SectionForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
};

export default ModifySection;