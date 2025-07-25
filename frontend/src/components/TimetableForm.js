import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DBContext from "../context/DBContext";
import getFormData from "../utils/getFormData";

function FormBody(props){
  const {formData,setFormData,handleSubmit} = props;
  const { classesAPI } = useContext(DBContext);
  const [classList, setClassList] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    classesAPI
      .get()
      .then((classes)=>(classes && setClassList(classes)));
  }, [classesAPI]);

  if (!classList.length) return <div>Loading...</div>;

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.classId = formData.classId ? "" : "Class is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const trySubmit = (e) => {
    e.preventDefault();
    if(validate()) handleSubmit();
  }

  return (
    <form onSubmit={trySubmit} className="w-full flex">
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"80%"}
        marginX={"auto"}
        padding={"1%"}
        minWidth={"50vw"}
      >
        <Grid container columns={8} columnSpacing={1} rowSpacing={1}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              label={"Name"}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                fullWidth
                required
                label={"Select Class"}
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                error={!!errors.classId}
              >
                {classList.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.classId}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel>Select Type</InputLabel>
              <Select
                fullWidth
                required
                label={"Select Type"}
                name="timeTableType"
                value={formData.timeTableType}
                defaultValue={"Class"}
                onChange={handleChange}
                error={!!errors.timeTableType}
              >
                <MenuItem value={"Class"}>Class</MenuItem>
                <MenuItem value={"Exam"}>Exam</MenuItem>
              </Select>
              <FormHelperText>{errors.timeTableType}</FormHelperText>
            </FormControl>
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

export default function TimetableForm(props) {
  const { timetablesAPI } = useContext(DBContext);
  const {timetableData=null,onSubmit=()=>{}} = props;
  const [formData, setFormData] = useState(
    getFormData(timetableData,{
      name: "",
      classId: "",
      timeTableType: "Class",
    })
  );
  const navigate = useNavigate();

  function handleSubmit() {
    console.log("form",formData);
    if(timetableData==null){
      timetablesAPI
        .post({postData: formData})
        .then((data) => {
          console.log("Added timetable: ",data);
          navigate("/academics/timetable/manage-timetables",{replace: true});
          onSubmit()
        })
        .catch((err)=>console.log("Error adding timetable: ",err));
    }else{
      const {id} = timetableData;
      const {sn,...putData} = {id,...formData};
      timetablesAPI
        .put({id,putData})
        .then((data) => {
          console.log("Modified timetable: ",data);
          onSubmit()
        })
        .catch((err)=>console.log("Error modifying timetable: ",err));
    }
  }
  return <FormBody 
    formData={formData}
    setFormData={setFormData}
    handleSubmit={handleSubmit}
  />
}
