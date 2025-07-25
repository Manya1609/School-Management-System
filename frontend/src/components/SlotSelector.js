import {
    Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function slotKey(isClass,day,date){
  if (isClass) {
    return Number(day);
  } else {
    return date?.format()?.split("T")?.[0];
  }
}

export default function SlotSelector(props) {
  const { isClass, assignments, setAssignments, subjects } = props;
  const [slot, setSlot] = useState("");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState(0);
  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    if (!slot) return;
    const assigned = assignments[slot].assigned;
    const k = slotKey(isClass,day,date);
    if(k==null) return;
    const assgnFound = assigned?.[k];
    setSubject(assgnFound?.subjectId ?? "");
  }, [isClass, assignments, slot, day, date]);

  function handleSubmit(e) {
    e.preventDefault();
    let assigned = { ...assignments[slot].assigned };
    const k = slotKey(isClass,day,date);
    if(k==null) return;
    if (subject) {
      assigned = {
        ...assigned,
        [k]: {manageId: null, subjectId: subject},
      };
    } else {
      delete assigned[k];
    }
    setAssignments({
      ...assignments,
      [slot]: {
        ...assignments[slot],
        assigned,
      },
    });
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Grid container columns={8} columnSpacing={1} sx={{ width: "100%" }}>
        <Grid item xs={2}>
          <FormControl fullWidth sx={{ marginY: "1%" }}>
            <InputLabel>Time Slot</InputLabel>
            <Select
              required
              label="Time Slot"
              name="timeslot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
            >
              {Object.keys(assignments).map((tsid) => (
                <MenuItem
                  key={tsid}
                  value={tsid}
                >{`${assignments[tsid].startTime} - ${assignments[tsid].endTime}`}</MenuItem>
              ))}
            </Select>
                <Box textAlign={"center"}>
                  <Link
                    underline="hover"
                    href="/slots"
                    target="_blank"
                    rel="noreferrer"
                    fontSize={"medium"}
                  >
                    Manage Time Slots
                  </Link>{" "}
                  <OpenInNewIcon
                    fontSize="small"
                    color="primary"
                    sx={{ marginBottom: "0.8%" }}
                  />
                </Box>
          </FormControl>
        </Grid>
        {isClass && (
          <Grid item xs={2}>
            <FormControl fullWidth sx={{ marginY: "1%" }}>
              <InputLabel>Day</InputLabel>
              <Select
                required
                label="Day"
                name="day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                {daysList.map((d, i) => (
                  <MenuItem key={i} value={i}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {!isClass && (
          <Grid item xs={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%", marginY: "1%" }}
                label={"Date"}
                name="date"
                value={date}
                onChange={(e) => setDate(e)}
                disablePast
              />
            </LocalizationProvider>
          </Grid>
        )}
        <Grid item xs={2}>
          <FormControl fullWidth sx={{ marginY: "1%" }}>
            <InputLabel>Subject</InputLabel>
            <Select
              label="Subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjects.map((sub) => (
                <MenuItem key={sub.subjectId} value={sub.subjectId}>
                  {sub.shortName}
                </MenuItem>
              ))}
            </Select>
                <Box textAlign={"center"}>
                  <Link
                    underline="hover"
                    href="/subjects"
                    target="_blank"
                    rel="noreferrer"
                    fontSize={"medium"}
                  >
                    Manage Subjects
                  </Link>{" "}
                  <OpenInNewIcon
                    fontSize="small"
                    color="primary"
                    sx={{ marginBottom: "0.8%" }}
                  />
                </Box>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
            <Box display={"flex"} flexDirection={"column"} height={"100%"} paddingBottom={"17%"}>
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{marginY: "auto", height: "80%"}}>
            {subject==="" ? "Remove" : "Assign"}
          </Button>
          </Box>
        </Grid>
        <Grid item xs={1}>
        <Box display={"flex"} flexDirection={"column"} height={"100%"} paddingBottom={"17%"}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => setSubject("")}
            disabled={subject === ""}
            sx={{marginY: "auto", height: "80%"}}
          >
            Clear
          </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
