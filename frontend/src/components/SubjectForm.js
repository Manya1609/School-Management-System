import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, MenuItem, Grid, Box, Alert } from "@mui/material";
import DBContext from "../context/DBContext";


const SubjectForm = ({formData, setFormData, errors, handleSubmit}) => {

    const { classesAPI, usersAPI } = useContext(DBContext);
	const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([])

    async function getClasses(){
		try{
			let classesList = await classesAPI.get();
			setClasses(classesList);
		}
		catch(err){
			console.error("There was an error while fetching the classes!", err)
		}
	}

    async function getTeachers(){
        try{
            let teachersList = await usersAPI.getByRole({role:"teacher"})
            setTeachers(teachersList)
        }
        catch(err){
            console.error("There was an error fetching the details of the teachers");
        }
    }

    useEffect(() => {
		getClasses()
        getTeachers()
	}, [classesAPI, usersAPI]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return(
        <Box display="flex" marginLeft={4} marginTop={4}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    
                    <Grid item xs={12}>
                        <TextField
                            label="Subject Name"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.subjectName}
                            helperText={errors.subjectName}
                            required={true}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Short Name"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.shortName}
                            helperText={errors.shortName}
                            required={true}
                        />
                    </Grid>
                    
                    
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Select Class"
                            name="classId"
                            value={formData.classId}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.classId}
                            helperText={errors.classId}
                            required={true}
                        >
                            {classes.map((clazz) => (
                                <MenuItem key={clazz.id} value={clazz.id}>
                                    {clazz.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Select Teacher"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.userId}
                            helperText={errors.userId}
                            required={true}
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.userId} value={teacher.userId}>
                                    {teacher.fullName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>


                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Add Subject
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default SubjectForm;