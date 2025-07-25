import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DBContext from "../context/DBContext";
import { useAuth } from "../hooks/useAuth";
import getFormData from "../utils/getFormData";

const todayDateStr = (new Date()).toLocaleDateString().split('/').reverse().join('-');

function FormBody(props){
  const {formData,setFormData,handleSubmit} = props;
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = formData.title ? "" : "Title is required.";
    tempErrors.dueDate = formData.dueDate >= todayDateStr ? "" : "Due date cannot be in the past."
    tempErrors.content = formData.content ? "" : "Content is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  function trySubmit(e) {
    e.preventDefault();
    if (validate()) handleSubmit();
  }
  return (
    <form onSubmit={trySubmit} className="w-full flex">
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"80%"}
        marginX={"auto"}
        padding={"1%"}
      >
        <Grid container columns={8} columnSpacing={1} rowSpacing={1}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              required
              label={"Title"}
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Notice Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                  shrink: true,
              }}
              placeholder="Notice Date"
              error={!!errors.dueDate}
              helperText={errors.dueDate}
          />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              required
              label={"Content"}
              name="content"
              multiline
              rows={8}
              value={formData.content}
              onChange={handleChange}
              error={!!errors.content}
              helperText={errors.content}
            />
          </Grid>
          <Grid item xs={8}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default function NoticeForm(props) {
  const {noticeData=null,onSubmit=()=>{}} = props;
  const {noticesAPI} = useContext(DBContext);
  const {user} = useAuth();
  const [formData, setFormData] = useState(getFormData(noticeData,{
    userId: user.userId,
    title: "",
    content: "",
    dueDate: todayDateStr,
  }));
  const navigate = useNavigate();

  function handleSubmit(e) {
    console.log("form",formData);
    if(noticeData==null){
      noticesAPI
        .post({postData: formData})
        .then((data)=>{
          console.log("Added notice: ",data);
          navigate("/notices/manage-notices",{replace: true});
          onSubmit();
        }).catch((err)=>console.log("Error adding notice: ",err));
    }else{
      const {id} = noticeData;
      const {sn, ...putData} = formData;
      noticesAPI
        .put({id, putData})
        .then((data)=>{
          console.log("Modified notice: ",data);
          onSubmit();
        }).catch((err)=>console.log("Error modifying notice: ",err));
    }
  }
  
  return <FormBody 
    formData={formData}
    setFormData={setFormData}
    handleSubmit={handleSubmit}
  />
}
