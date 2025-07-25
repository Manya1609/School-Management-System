import React, { useState, useContext } from "react";
import { TextField, Button, MenuItem, Grid, Box, Alert } from "@mui/material";


const ClassForm = ({formData, setFormData, errors, handleSubmit}) => {

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
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                            required={true}
                        />
                    </Grid>
                    
                    
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Class Type"
                            name="classType"
                            value={formData.classType}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.classType}
                            helperText={errors.classType}
                            required={true}
                        >
                            {[
                                "Junior",
                                "Middle",
                                "Senior",
                            ].map((classType) => (
                                <MenuItem key={classType} value={classType}>
                                    {classType}
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
                            Add Class
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default ClassForm;