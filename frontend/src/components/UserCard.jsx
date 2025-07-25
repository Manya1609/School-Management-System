import React from "react";
import { Box, Avatar, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, setSelectedUser }) => {
    const navigate = useNavigate();

    const handleSubmit = () => {
        setSelectedUser(null);
        navigate("/users/manage-users");
    };

    const renderAdditionalInfo = (addnlInfo, level = 0) => {
        const {subjects = null, cls = null, sec = null, ...otherInfo} = addnlInfo;
        const info = {
            ...otherInfo,
            ...(addnlInfo.hasOwnProperty('subjects') ? {subjects: subjects.map(({subjectName,shortName})=>`${subjectName} (${shortName})`)} : {}),
            ...(addnlInfo.hasOwnProperty('cls') ? {'class-section': (cls && sec) ? `${cls.name} - ${sec.name}` : null} : {}),
        }
        return Object.keys(info).map((key) => {
            if (typeof info[key] === "object" && info[key] !== null) {
                return (
                    <Box
                        key={key}
                        mt={1}
                        pl={2 * (level + 1)}
                        borderLeft="1px solid #ccc"
                    >
                        <Typography variant="body2" color="textSecondary">
                            <strong>{key}:</strong>
                        </Typography>
                        {renderAdditionalInfo(info[key], level + 1)}
                    </Box>
                );
            } else {
                return (
                    <Box key={key} mt={1} pl={2 * (level + 1)}>
                        <Typography variant="body2" color="textSecondary">
                            <strong>{key}:</strong> {info[key]}
                        </Typography>
                    </Box>
                );
            }
        });
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    maxWidth: 400,
                    width: "100%",
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="left">
                    <Avatar
                        src={user.photo}
                        alt={user.fullName}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h5" gutterBottom>
                        {user.fullName}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>ID:</strong> {user.id}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>Username:</strong> {user.username}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>Role:</strong> {user.role}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>Phone Number:</strong> {user.phone}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>Address:</strong> {user.address}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        <strong>Date of Birth:</strong> {user.dateOfBirth}
                    </Typography>
                    {Object.keys(user.additionalInfo).length > 0 && (
                        <Box mt={2} width="100%">
                            <Typography variant="body2" color="textSecondary">
                                <strong>Additional Info:</strong>
                            </Typography>
                            {renderAdditionalInfo(user.additionalInfo)}
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        Back
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserCard;
