import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Box } from "@mui/material";
import { UserContext } from "../context/UserContext";
import UserCard from "./UserCard";

const UserList = () => {
    let {users} = useContext(UserContext);
    let navigate = useNavigate();

    const handleAddUser = () => {
        navigate("/addUser");
    };

    return (
        <div>
            <Box
                display="flex"
                justifyContent="center"
                marginBottom={2}
                marginTop={10}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            </Box>
            <Grid container spacing={8} padding={10}>
                {users &&
                    users.map((user) => <UserCard key={user.id} user={user} />)}
            </Grid>
        </div>
    );
};

export default UserList;
