import React, { useContext, useEffect, useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { useSelector } from "react-redux";
import DBContext from "../context/DBContext";

const UserForm = ({
    formData,
    setFormData,
    handleSubmit,
    errors,
    validate,
    disablePassword = false
}) => {
    // redux state
    const count = useSelector((state) => state.counter.value);
    const {subjectsAPI,classesAPI} = useContext(DBContext);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [classSections, setClassSections] = useState([]);
    const [infoIDStore, setInfoIDStore] = useState({
        subjectIDs: [], classId: "", sectionId: ""
    })

    useEffect(() => {
      subjectsAPI.get().then(subjects=>setAllSubjects(subjects));
    }, [subjectsAPI]);
    useEffect(() => {
        classesAPI.get().then(classes=>setAllClasses(classes));
    }, [classesAPI]);
    useEffect(() => {
        const {cls} = formData.additionalInfo;
        if(cls!=null)
            classesAPI.getSections({id: cls.id}).then(sections=>setClassSections(sections));
    }, [formData.additionalInfo,classesAPI]);

    useEffect(()=>{
        if(formData.role !== "teacher" && formData.additionalInfo.hasOwnProperty("subjects")){
            // console.log("Removing subjects");
            const {subjects,...additionalInfo} = formData.additionalInfo;
            setFormData({...formData,additionalInfo});
        }else if(formData.role === "teacher" && !formData.additionalInfo.hasOwnProperty("subjects")){
            // console.log("Adding subjects");
            setFormData({
                ...formData,
                additionalInfo: {
                    ...formData.additionalInfo,
                    subjects: [],
                },
            });
        }
        if(formData.role !== "student" && formData.additionalInfo.hasOwnProperty("cls")){
            // console.log("Removing subjects");
            const {cls,sec,...additionalInfo} = formData.additionalInfo;
            setFormData({...formData,additionalInfo});
        }else if(formData.role === "student" && !formData.additionalInfo.hasOwnProperty("cls")){
            // console.log("Adding subjects");
            setFormData({
                ...formData,
                additionalInfo: {
                    ...formData.additionalInfo,
                    cls: null,
                    sec: null
                },
            });
        }
    }, [formData, setFormData]);
    useEffect(()=>{
        // console.log("addnl info",formData.additionalInfo);
        // console.log("id store",infoIDStore);
        if(formData.additionalInfo.hasOwnProperty("subjects")){
            const selectedIDs = formData.additionalInfo.subjects?.map(({subjectId})=>subjectId) ?? [];
            const doUpdate = (()=>{
                if(infoIDStore.subjectIDs.length !== selectedIDs.length) return true;
                for(let i = 0; i < selectedIDs.length; i++){
                    if(infoIDStore.subjectIDs[i] !== selectedIDs[i]) return true;
                }
                return false;
            })();
            if(doUpdate) setInfoIDStore({...infoIDStore, subjectIDs: selectedIDs});
        }
        if(infoIDStore.classId !== (formData.additionalInfo.cls?.id ?? "")){
            setInfoIDStore({...infoIDStore, classId: formData.additionalInfo.cls.id});
        }
        if(infoIDStore.sectionId !== (formData.additionalInfo.sec?.id ?? "")){
            setInfoIDStore({...infoIDStore, sectionId: formData.additionalInfo.sec.id});
        }
    },[formData.additionalInfo,infoIDStore]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAdditionalInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            additionalInfo: {
                ...formData.additionalInfo,
                [name]: value,
            },
        });
    };

    return (
        <Box display="flex" justifyContent="center" paddingX={10} paddingY={3}>
            <form onSubmit={handleSubmit}>
                {/* display count of successful requests */}
                <Box textAlign="center" marginBottom={2}>
                    <Box
                        fontWeight="bold"
                        color={
                            count > 0 ? "green" : count < 0 ? "red" : "black"
                        }
                    >
                        {count > 0 &&
                            `${count} user(s) added/modified successfully!`}
                        {count < 0 && `Failed to add/modify user(s).`}
                        {count === 0 && `Please start adding/modifying users.`}
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={disablePassword ? 5 : 4}>
                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={formData.role}
                                defaultValue= {formData.role}
                                onChange={handleChange}
                                label="Role"
                                data-testid="role-dropdown"
                            >
                                <MenuItem
                                    value="admin"
                                    data-testid="role-option-admin"
                                >
                                    Admin
                                </MenuItem>
                                <MenuItem
                                    value="super_admin"
                                    data-testid="role-option-super-admin"
                                >
                                    Super Admin
                                </MenuItem>
                                <MenuItem
                                    value="student"
                                    data-testid="role-option-student"
                                >
                                    Student
                                </MenuItem>
                                <MenuItem
                                    value="teacher"
                                    data-testid="role-option-teacher"
                                >
                                    Teacher
                                </MenuItem>
                            </Select>
                            <FormHelperText>{errors.role}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={disablePassword ? 6 : 4}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={disablePassword ? 1 : 4} visibility={disablePassword ? "hidden" : "visible"}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            required={!disablePassword}
                            disabled={disablePassword}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            placeholder="Date of Birth"
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>

                    {/* Conditional Rendering for Student */}
                    {formData.role === "student" && (
                        <>
                            <Grid item xs={6}>
                                <FormControl fullWidth error={!!errors.role}>
                                    <InputLabel id="cls-label">Classes</InputLabel>
                                    <Select
                                        labelId="cls-label"
                                        id="cls"
                                        name="cls"
                                        value={infoIDStore.classId}
                                        defaultValue= {infoIDStore.classId}
                                        onChange={(e)=>{
                                            const cls = allClasses.find(c=>c.id===e.target.value);
                                            return handleAdditionalInfoChange({
                                                target: {
                                                    name: "cls",
                                                    value: cls
                                                }
                                            })
                                        }}
                                        label="Classes"
                                        data-testid="cls-dropdown"
                                        error={!!errors.cls}
                                    >
                                        {allClasses.map(({id,name})=>{
                                            return (<MenuItem key={id} data-testid={`cls-option-${id}`} value={id}>
                                                {`${name}`}
                                            </MenuItem>);
                                        })}
                                    </Select>
                                    <FormHelperText>{errors.cls}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth error={!!errors.role}>
                                    <InputLabel id="sec-label">Sections</InputLabel>
                                    <Select
                                        labelId="sec-label"
                                        id="sec"
                                        name="sec"
                                        value={infoIDStore.sectionId}
                                        defaultValue= {infoIDStore.sectionId}
                                        onChange={(e)=>{
                                            const sec = classSections.find(s=>s.id===e.target.value);
                                            return handleAdditionalInfoChange({
                                                target: {
                                                    name: "sec",
                                                    value: sec
                                                }
                                            })
                                        }}
                                        label="Sections"
                                        data-testid="sec-dropdown"
                                        error={!!errors.sec}
                                        disabled={classSections.length===0}
                                    >
                                        {classSections.map(({id,name})=>{
                                            return (<MenuItem key={id} data-testid={`sec-option-${id}`} value={id}>
                                                {`${name}`}
                                            </MenuItem>);
                                        })}
                                    </Select>
                                    <FormHelperText>{errors.sec}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </>
                    )}

                    {/* Conditional Rendering for Teacher */}
                    {formData.role === "teacher" && (
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel id="subjects-label">Subjects</InputLabel>
                                <Select
                                    labelId="subjects-label"
                                    id="subjects"
                                    name="subjects"
                                    value={infoIDStore.subjectIDs}
                                    defaultValue= {infoIDStore.subjectIDs}
                                    onChange={(e)=>{
                                        const selectionList =  ((val)=>typeof val === 'string' ? val.split(',') : val)(e.target.value);
                                        const subjects = allSubjects.filter(({subjectId})=>selectionList.includes(subjectId));
                                        return handleAdditionalInfoChange({
                                            target: {
                                                name: "subjects",
                                                value: subjects
                                            }
                                        })
                                    }}
                                    label="Subjects"
                                    data-testid="subjects-dropdown"
                                    multiple
                                    error={!!errors.subjects}
                                >
                                    {allSubjects.map(({subjectId:id,subjectName,shortName})=>{
                                        return (<MenuItem key={id} data-testid={`subjects-option-${id}`} value={id}>
                                            {`${subjectName} (${shortName})`}
                                        </MenuItem>);
                                    })}
                                </Select>
                                <FormHelperText>{errors.subjects}</FormHelperText>
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default UserForm;
