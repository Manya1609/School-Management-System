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
  FormLabel,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getFormData from "../utils/getFormData";
import DBContext from "../context/DBContext";

function TimeSelector(props) {
  const { id, initTime, handleTimeChange } = props;

  const hhList = [
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
  ];
  const mmList = ["00", "15", "30", "45"];
  const [hh, setHH] = useState(initTime.split(':')[0]);
  const [mm, setMM] = useState(initTime.split(':')[1]);

  useEffect(() => {
    const time = `${hh}:${mm}:00`;
    if(initTime!==time) handleTimeChange(time);
  }, [initTime,handleTimeChange, hh, mm]);

  return (
    <Box width={"100%"} display={"flex"} marginY={"2px"}>
      <FormControl sx={{ width: "40%" }}>
        <InputLabel id={`${id}-hh`}>hh</InputLabel>
        <Select
          label="hh"
          labelId={`${id}-hh`}
          value={hh}
          onChange={(e) => {
            setHH(e.target.value);
          }}
        >
          {hhList.map((h) => (
            <MenuItem key={h} value={h}>
              {h}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        marginX={"3px"}
        width={"fit-content"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        fontWeight={"bold"}
        fontSize={"large"}
      >
        :
      </Box>
      <FormControl sx={{ width: "40%" }}>
        <InputLabel id={`${id}-mm`}>mm</InputLabel>
        <Select
          label="mm"
          labelId={`${id}-mm`}
          value={mm}
          onChange={(e) => {
            setMM(e.target.value);
          }}
        >
          {mmList.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function FormBody(props){
  const {formData,setFormData,handleSubmit} = props;
  console.log("formbody",formData);
  const [error, setError] = useState(null);

  const validate = () => {
    let tempError = null;
    if(formData.startTime>=formData.endTime){
      tempError = "Start time must be before end time!"
    }
    setError(tempError);
    return tempError == null;
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
        minWidth={"60vw"}
      >
        <Grid container columns={2} columnSpacing={1} rowSpacing={1}>
          <Grid item xs={1}>
            <FormLabel>Start Time</FormLabel>
            <TimeSelector
              id={"startTime"}
              initTime={formData.startTime}
              handleTimeChange={(time) => {
                setFormData({ ...formData, startTime: time });
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <FormLabel>End Time</FormLabel>
            <TimeSelector
              id={"endTime"}
              initTime={formData.endTime}
              handleTimeChange={(time) => {
                setFormData({ ...formData, endTime: time });
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Box width={"100%"} color={"red"}>
              {error}
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default function SlotsForm(props) {
  const {slotData=null,onSubmit=()=>{}} = props;
  const {timetablesAPI} = useContext(DBContext);
  const [formData, setFormData] = useState(getFormData(slotData,{
    startTime: "08:00:00",
    endTime: "08:00:00",
  }));
  const navigate = useNavigate();

  function handleSubmit(e) {
    console.log(formData);
    if(slotData==null){
      timetablesAPI.slots
        .post({postData: formData})
        .then((data)=>{
          console.log("Added timeslot: ",data);
          navigate("/slots/manage-slots",{replace: true});
          onSubmit()
        }).catch((err)=>console.log("Error adding timeslot: ",err));
    }else{
      const {id} = slotData;
      const {sn,...putData} = {id, ...formData};
      timetablesAPI.slots
        .put({id, putData})
        .then((data)=>{
          console.log("Modified timeslot: ",data);
          onSubmit()
        }).catch((err)=>console.log("Error modifying timeslot: ",err));
    }
  }

  return <FormBody 
    formData={formData}
    setFormData={setFormData}
    handleSubmit={handleSubmit}
  />
}
