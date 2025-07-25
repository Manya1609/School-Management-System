import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs'; // Import dayjs
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
    Collapse,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDropzone } from 'react-dropzone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DBContext from '../context/DBContext';

const ManageSystemSettings = () => {
    const defaultTermEndDate = dayjs('2024-03-31'); // Default date for Term End
    const defaultTermBeginDate = dayjs('2024-04-01'); // Default date for Term Begin

    const [formData, setFormData] = useState({
        nameOfSchool: '',
        currentSession: '2023-2024',
        schoolAcronym: '',
        phone: '',
        schoolEmail: '',
        schoolAddress: '',
        termEnds: defaultTermEndDate, // Set default date here
        nextTermBegins: defaultTermBeginDate, // Set default date here
        lockExam: '',
        crecheFee: '',
        juniorSecondaryFee: '',
        nurseryFee: '',
        preNurseryFee: '',
        primaryFee: '',
        seniorSecondaryFee: '',
        logo: null
    });
    const [showFees, setShowFees] = useState(false);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const {systemAPI} = useContext(DBContext);
    const navigate = useNavigate();
    const searchParams = useSearchParams()[0];
    const isSetup = searchParams.get('setup');

    useEffect(()=>{
        if(isSetup){
            setError('System settings are required! Please finish setting them up to use this site.');
            setOpenSnackbar(true);
        }else{
            systemAPI.get().then(data=>{ 
                console.log(data);
                setFormData(data);
            });
        }
    },[isSetup,systemAPI]);

    const handleInputChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleDateChange = (field) => (date) => {
        setFormData({ ...formData, [field]: date });
    };

    const handleDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setError('Only one image file is allowed. Please upload a valid image file.');
            setOpenSnackbar(true);
            return;
        }

        if (acceptedFiles.length > 1) {
            setError('Only one image file is allowed.');
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

    // Define the handleSubmit function
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('System Settings Form Data:', formData);
        // Handle form submission logic here
        let submitOK = true;
        try{
            await systemAPI.put({id: 1, putData: formData});
        }catch(err1){
            try{
                await systemAPI.post({postData: {...formData, id:1}});
            }catch(err2){
                submitOK = false;
                alert("Submission failed. Please try again.");
            }
        }
        if(submitOK){
            console.log("Submit OK!");
            alert("Settings submitted successfully!");
            if(isSetup) navigate("/dashboard",{replace: true});
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box paddingX={5} paddingY={3}>
                <Typography variant="h5" gutterBottom align="left" style={{ fontWeight: 'bold' }}>
                    Manage System Settings
                </Typography>

                <Box padding={2} borderRadius={1} boxShadow={2} bgcolor="background.paper" marginTop={5} marginBottom={3}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }} marginBottom={3}>
                        Update System Settings
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="School Name"
                                placeholder="National Public School"
                                fullWidth
                                value={formData.nameOfSchool}
                                onChange={handleInputChange('nameOfSchool')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth required>
                                <InputLabel shrink>Current Session</InputLabel>
                                <Select
                                    value={formData.currentSession}
                                    onChange={handleInputChange('currentSession')}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>2022-2023</MenuItem>
                                    <MenuItem value="2023-2024">2023-2024</MenuItem>
                                    <MenuItem value="2024-2025">2024-2025</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="School Acronym"
                                placeholder="NPS"
                                fullWidth
                                value={formData.schoolAcronym}
                                onChange={handleInputChange('schoolAcronym')}
                                InputLabelProps={{ shrink: true }}
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
                                label="Email"
                                placeholder="nps@gmail.com"
                                fullWidth
                                value={formData.schoolEmail}
                                onChange={handleInputChange('schoolEmail')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Address"
                                placeholder="Noida, UP, India"
                                fullWidth
                                value={formData.schoolAddress}
                                onChange={handleInputChange('schoolAddress')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ marginRight: 0 }}>
                            <DatePicker
                                label="This Term Ends"
                                defaultValue={defaultTermEndDate}
                                value={dayjs(formData.termEnds)}
                                onChange={handleDateChange('termEnds')}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                label="Next Term Begins"
                                defaultValue={defaultTermBeginDate}
                                value={dayjs(formData.nextTermBegins)}
                                onChange={handleDateChange('nextTermBegins')}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>

                        {/* Logo Upload Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                                Upload School Logo
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

                <Box padding={2} borderRadius={1} boxShadow={2} bgcolor="background.paper" marginTop={5} marginBottom={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                            Next Term Fees
                        </Typography>
                        <IconButton onClick={() => setShowFees(!showFees)}>
                            {showFees ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                    <Collapse in={showFees}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Creche"
                                    placeholder="1600"
                                    fullWidth
                                    value={formData.crecheFee}
                                    onChange={handleInputChange('crecheFee')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Junior Secondary"
                                    placeholder="1600"
                                    fullWidth
                                    value={formData.juniorSecondaryFee}
                                    onChange={handleInputChange('juniorSecondaryFee')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Nursery"
                                    placeholder="1600"
                                    fullWidth
                                    value={formData.nurseryFee}
                                    onChange={handleInputChange('nurseryFee')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Pre-Nursery"
                                    placeholder="1600"
                                    fullWidth
                                    value={formData.preNurseryFee}
                                    onChange={handleInputChange('preNurseryFee')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Primary"
                                    placeholder="1600"
                                    fullWidth
                                    value={formData.primaryFee}
                                    onChange={handleInputChange('primaryFee')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Senior Secondary"
                                    placeholder="1600"
                                    fullWidth
                                    value={formData.seniorSecondaryFee}
                                    onChange={handleInputChange('seniorSecondaryFee')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
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
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default ManageSystemSettings;
