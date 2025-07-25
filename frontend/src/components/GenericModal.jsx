import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const GenericModal = ({ open, handleClose, record, fields }) => {
    if (!record) {
        return null; // Return null if record is null
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">Details</Typography>
                {fields.map((field) => (
                    <Typography key={field} sx={{ mt: 2 }}><strong>{field}:</strong> {record[field]}</Typography>
                ))}
            </Box>
        </Modal>
    );
};

export default GenericModal;
