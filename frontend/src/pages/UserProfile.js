import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Box,
    Typography,
    TextField,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDropzone } from 'react-dropzone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DBContext from '../context/DBContext';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { user } = useAuth();
    const {id=null} = useParams();
    const userId = id ?? user.userId;
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email:'',
        gender: '',
        address: '',
        phone: '',
        telephone: '',
        role:'',
        nationality:'',
        state:'',
        lga:'',
        bloodGroup:'',
        clazz:'',
        section:'',
        logo: null
    });
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { usersAPI } = useContext(DBContext);

    // Fetch user details from API
    async function getUserDetails() {
        try {
            let userDetails = await usersAPI.getUserById({userId});
            console.log(userDetails)
            setFormData(userDetails);
            setLoading(false);
        } catch (err) {
            console.error("There was an error fetching the profile!", err);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    // Validate form fields (simple example)
    const validate = () => {
        let tempErrors = {};
        tempErrors.fullName = formData.fullName ? "" : "Full Name is required.";
        tempErrors.phone = formData.phone
            ? formData.phone.length === 10
                ? ""
                : "Phone Number must be 10 digits long."
            : "Phone Number is required.";
        tempErrors.gender = formData.gender ? "" : "Gender is required.";
        tempErrors.address = formData.address ? "" : "Address is required.";
        tempErrors.gender = formData.gender ? "" : "Gender is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const id=userId
                await usersAPI.put({ putData: formData, id });
                alert('Profile updated successfully!');
            } catch (err) {
                console.error('Error updating profile:', err);
            }
        }
    };

    const handleInputChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleDateChange = (field) => (date) => {
        setFormData({ ...formData, [field]: date });
    };

    const handleDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setErrors('Only one image file is allowed. Please upload a valid image file.');
            setOpenSnackbar(true);
            return;
        }

        if (acceptedFiles.length > 1) {
            setErrors('Only one image file is allowed.');
            setOpenSnackbar(true);
            return;
        }

        setFormData({ ...formData, logo: acceptedFiles[0] });
    };

    const handleDeleteLogo = () => {
        setFormData({ ...formData, logo: null });
    };

    // Dropzone setup
    const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        onDrop: handleDrop,
        multiple: false // Only one file allowed
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[75%] transition-opacity duration-500 ease-in-out">
                <CircularProgress />
            </div>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box paddingX={5} paddingY={3}>
                <Typography variant="h5" gutterBottom align="left" style={{ fontWeight: 'bold' }}>
                    {id ? `${formData.username}'s` : 'My'} Profile
                </Typography>

                <Box padding={2} borderRadius={1} boxShadow={2} bgcolor="background.paper" marginTop={5} marginBottom={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Full Name"
                                placeholder="Your name"
                                fullWidth
                                value={formData.fullName}
                                onChange={handleInputChange('fullName')}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="username"
                                placeholder="username"
                                fullWidth
                                value={formData.username}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="email"
                                placeholder="email"
                                fullWidth
                                value={formData.email}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Role"
                                placeholder="role"
                                fullWidth
                                value={formData.role}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth required>
                                <InputLabel shrink>Gender</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={handleInputChange('gender')}
                                    displayEmpty
                                    required
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="non-binary">Non Binary</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Address"
                                placeholder="Noida, UP, India"
                                fullWidth
                                value={formData.address}
                                onChange={handleInputChange('address')}
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={6}>
                            <TextField
                                label="Phone"
                                placeholder="1234567890"
                                fullWidth
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Nationality"
                                placeholder="India"
                                fullWidth
                                value={formData.nationality}
                                onChange={handleInputChange('nationality')}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="State"
                                placeholder="Karnataka"
                                fullWidth
                                value={formData.state}
                                onChange={handleInputChange('state')}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="LGA"
                                placeholder="Marathahalli"
                                fullWidth
                                value={formData.lga}
                                onChange={handleInputChange('lga')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Blood Group"
                                placeholder="O+"
                                fullWidth
                                value={formData.bloodGroup}
                                onChange={handleInputChange('bloodGroup')}
                            />
                        </Grid>
                        

                        {/* Logo Upload Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                                Upload Profile Picture
                            </Typography>
                            <section className="container">
                                <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop a logo here, or click to select a logo</p>
                                    <em>(Only *.jpeg and *.png images will be accepted)</em>
                                </div>
                                <aside>
                                    {formData.logo ? (
                                        <Box display="flex" alignItems="center" marginTop={2}>
                                            <img src={URL.createObjectURL(formData.logo)} alt="Logo Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginRight: 10 }} />
                                            <IconButton onClick={handleDeleteLogo} style={{ color: 'red' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <CheckCircleIcon style={{ color: 'green', fontSize: 30 }} />
                                        </Box>
                                    ) : (
                                        fileRejections.length > 0 && (
                                            <Box display="flex" alignItems="center" marginTop={2}>
                                                <CancelIcon style={{ color: 'red', fontSize: 30, marginRight: 10 }} />
                                                <Typography variant="body1" color="red">Invalid file type or multiple files uploaded.</Typography>
                                            </Box>
                                        )
                                    )}
                                </aside>
                            </section>
                        </Grid>

                    </Grid>
                </Box>

                

                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'none' }}
                    >
                        Save Changes
                    </Button>
                </Box>

                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="error">
                        {errors}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default UserProfile;
