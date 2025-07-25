import React, { useContext, useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import DBContext from '../context/DBContext';

export function ResetPasswordForm(props){
    const {username,onSubmit} = props;
    const [pass,setPass] = useState("");
    const {systemAPI} = useContext(DBContext);
    function handleSubmit(e){
        e.preventDefault();
        systemAPI
            .resetPassword({params: {
                username,
                newPassword: pass
            }}).then((msg)=>{
                console.log(msg);
                onSubmit();
            }).catch((err)=>console.log("Error resetting password: ",err));
        
    }
    return <form onSubmit={handleSubmit}>
        <Grid container columns={5} columnSpacing={1} rowSpacing={1}>
            <Grid item xs={5} fontSize={"200%"}>
                Enter a new password for user: <b>{username}</b>
            </Grid>
            <Grid item xs>
                <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"
                    value={pass}
                    onChange={(e)=>setPass(`${e.target.value}`)}
                    required={true}
                />
            </Grid>
            <Grid item xs={1} display={"flex"}>
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ margin: "auto", width: "80%", height: "80%" }}
                >
                    Reset
                </Button>
            </Grid>
        </Grid>
    </form>
}