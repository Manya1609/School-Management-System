import React, { useState, useContext } from "react";
import { TextField, Button, MenuItem, Grid, Box, Alert } from "@mui/material";

const ExamForm = ({formData, setFormData, errors, handleSubmit}) => {

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
                            label="Term"
                            name="term"
                            value={formData.term}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.term}
                            helperText={errors.term}
                        >
                            {[
                                "Term 1",
                                "Term 2",
                                "Term 3",
                            ].map((term) => (
                                <MenuItem key={term} value={term}>
                                    {term}
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
                            Add Exam
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default ExamForm;