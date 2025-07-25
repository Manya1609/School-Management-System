import React, { useState, useEffect } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SendIcon from '@mui/icons-material/Send';

const SelectStudentMarksheet = () => {
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch classes on component mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:1234/classes');
                if (!response.ok) throw new Error('Failed to fetch classes');
                const data = await response.json();
                setClasses(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Fetch sections when a class is selected
    useEffect(() => {
        if (selectedClass) {
            const fetchSections = async () => {
                setLoading(true);
                try {
                    const response = await fetch('http://localhost:1234/sections');
                    if (!response.ok) throw new Error('Failed to fetch sections');
                    const data = await response.json();
                    // Filter sections based on selected class
                    setSections(data.filter(section => section.id === selectedClass));
                } catch (error) {
                    console.error('Error fetching sections:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSections();
        } else {
            setSections([]); // Clear sections if no class is selected
        }
    }, [selectedClass]);

    // Fetch students when a section is selected
    useEffect(() => {
        if (selectedSection) {
            const fetchStudents = async () => {
                setLoading(true);
                try {
                    const response = await fetch('http://localhost:1234/users');
                    if (!response.ok) throw new Error('Failed to fetch students');
                    const data = await response.json();
                    // Filter students based on class and section
                    const filteredStudents = data.filter(student =>
                        student.role === 'student' &&
                        student.additionalInfo.classID === selectedClass &&
                        student.additionalInfo.sectionID === selectedSection
                    );
                    setStudents(filteredStudents);
                } catch (error) {
                    console.error('Error fetching students:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStudents();
        } else {
            setStudents([]); // Clear students if no section is selected
        }
    }, [selectedSection, selectedClass]);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
        setSelectedSection(''); // Reset section when class changes
    };

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value);
    };

    return (
        <Box paddingX={5} paddingY={3}>
            <Typography variant="h4" gutterBottom align="left" style={{ fontWeight: 'bold' }}>
                Select Student Marksheet
            </Typography>

            <Box padding={2} borderRadius={1} boxShadow={2} bgcolor="background.paper" marginBottom={3}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    Select Class and Section
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth required>
                            <InputLabel shrink>Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={handleClassChange}
                                displayEmpty
                                renderValue={(value) => value || 'Select class'}
                            >
                                <MenuItem value="" disabled>Select class</MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth required>
                            <InputLabel shrink>Section</InputLabel>
                            <Select
                                value={selectedSection}
                                onChange={handleSectionChange}
                                displayEmpty
                                renderValue={(value) => value || 'Select section'}
                            >
                                <MenuItem value="" disabled>Select section</MenuItem>
                                {sections.map((section) => (
                                    <MenuItem key={section.id} value={section.id}>
                                        {section.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<SendIcon style={{ transform: 'rotate(-45deg)' }} />}
                                style={{ marginTop: '1.5rem', width: '100%' }}
                                onClick={() => { /* Handle button click */ }}
                                disabled={!selectedClass || !selectedSection} // Disable button if class or section is not selected
                            >
                                View Marksheet
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box padding={2} borderRadius={1} boxShadow={2} bgcolor="background.paper" marginBottom={3}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    Students of class {selectedClass} and section {selectedSection}
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={students}
                            columns={[
                                { field: 'fullName', headerName: 'Name', flex: 1 },
                                { field: 'id', headerName: 'Roll Number', flex: 1 },
                                {
                                    field: 'view',
                                    headerName: 'View Marksheet',
                                    flex: 1,
                                    renderCell: (params) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => { /* Handle view marksheet */ }}
                                        >
                                            View
                                        </Button>
                                    ),
                                },
                            ]}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default SelectStudentMarksheet;
