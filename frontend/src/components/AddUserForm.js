import React, { useState, useContext } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "admin", // Default value is "admin"
        email: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        additionalInfo: {},
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { addUser } = useContext(UserContext);

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

    const validate = () => {
        let tempErrors = {};
        tempErrors.username = formData.username ? "" : "Username is required.";
        tempErrors.password = formData.password ? "" : "Password is required.";
        tempErrors.email = formData.email ? "" : "Email is required.";
        tempErrors.fullName = formData.fullName ? "" : "Full Name is required.";
        tempErrors.phoneNumber = formData.phoneNumber
            ? ""
            : "Phone Number is required.";
        // tempErrors.address = formData.address ? "" : "Address is required.";
        tempErrors.dateOfBirth = formData.dateOfBirth
            ? ""
            : "Date of Birth is required.";

        // Additional validations based on role
        if (formData.role === "student") {
            tempErrors.classId = formData.additionalInfo.classId
                ? ""
                : "Class ID is required.";
            tempErrors.sectionId = formData.additionalInfo.sectionId
                ? ""
                : "Section ID is required.";
        } else if (formData.role === "teacher") {
            tempErrors.subjectIDs =
                formData.additionalInfo.subjectIDs &&
                formData.additionalInfo.subjectIDs.length > 0
                    ? ""
                    : "At least one Subject ID is required.";
        }

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            axios
                .post("http://localhost:1234/api/users", formData)
                .then((response) => {
                    console.log("User added successfully:", response.data);
                    addUser(response.data);
                    navigate("/users/manage-users");
                })
                .catch((error) => {
                    console.error("There was an error adding the user!", error);
                });
        }
    };

    return (
        <Box display="flex" justifyContent="center" paddingX={10} paddingY={3}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Role"
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="super_admin">
                                    Super Admin
                                </MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                            </Select>
                            <FormHelperText>{errors.role}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            required={true}
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
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber}
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
                            required={true}
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
                                <TextField
                                    fullWidth
                                    label="Class ID"
                                    name="classId"
                                    value={
                                        formData.additionalInfo.classId || ""
                                    }
                                    onChange={handleAdditionalInfoChange}
                                    error={!!errors.classId}
                                    helperText={errors.classId}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Section ID"
                                    name="sectionId"
                                    value={
                                        formData.additionalInfo.sectionId || ""
                                    }
                                    onChange={handleAdditionalInfoChange}
                                    error={!!errors.sectionId}
                                    helperText={errors.sectionId}
                                    required={true}
                                />
                            </Grid>
                        </>
                    )}

                    {/* Conditional Rendering for Teacher */}
                    {formData.role === "teacher" && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject IDs (comma separated)"
                                name="subjectIDs"
                                value={formData.additionalInfo.subjectIDs || ""}
                                onChange={(e) =>
                                    handleAdditionalInfoChange({
                                        target: {
                                            name: "subjectIDs",
                                            value: e.target.value.split(","),
                                        },
                                    })
                                }
                                error={!!errors.subjectIDs}
                                helperText={errors.subjectIDs}
                                required={true}
                            />
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

export default AddUserForm;
