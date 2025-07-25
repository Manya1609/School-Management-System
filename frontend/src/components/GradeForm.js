import React, { useState, useContext } from "react";
import { TextField, Button, MenuItem, Grid, Box, Alert } from "@mui/material";


const GradeForm = ({formData, setFormData, errors, handleSubmit}) => {

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
                            label="Grade Name"
                            name="gradeName"
                            value={formData.gradeName}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.gradeName}
                            helperText={errors.gradeName}
                            required={true}
                        />
                    </Grid>
                    
                    
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Grade Type"
                            name="gradeType"
                            value={formData.gradeType}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.gradeType}
                            helperText={errors.gradeType}
                        >
                            {[
                                "Relative",
                                "Absolute",
                            ].map((gradeType) => (
                                <MenuItem key={gradeType} value={gradeType}>
                                    {gradeType}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            label="Marks from"
                            name="markFrom"
                            value={formData.markFrom}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.markFrom}
                            helperText={errors.markFrom}
                            required={true}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            label="Marks To"
                            name="markTo"
                            value={formData.markTo}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.markTo}
                            helperText={errors.markTo}
                            required={true}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Select Remark"
                            name="gradeRemark"
                            value={formData.gradeRemark}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.gradeRemark}
                            helperText={errors.gradeRemark}
                            required={true}
                        >
                            {[
                                "Excellent",
                                "Average",
                                "Poor",
                            ].map((gradeRemark) => (
                                <MenuItem key={gradeRemark} value={gradeRemark}>
                                    {gradeRemark}
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
                            Add Grade
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default GradeForm