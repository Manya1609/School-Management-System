import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { Box, Button, Card, Divider, Grid, Link } from "@mui/material";
import TimetableView from "../components/TimetableView";
import SlotSelector from "../components/SlotSelector";
import DBContext from "../context/DBContext";
import { managedSlotAsEvent, managedSlotsWithShortNames } from "./SingleTimetable";

function managedSlotsAsAssignments(managedSlots,slotsList,isClass){
  const assgnMap = managedSlots.reduce((slotwise,slot)=>{
    const {id: manageId,timeSlotId, dayOfWeek, date, subjectId} = slot;
    return {
      ...slotwise,
      [timeSlotId]: {
        ...slotwise[timeSlotId],
        [isClass ? dayOfWeek : date]: {manageId,subjectId}
      }
    }
  },{});
  return slotsList.reduce((slotwise,slot)=>({
    ...slotwise,
    [slot.id]: {
      ...slot,
      assigned: assgnMap[slot.id]
    }
  }),{});
}
function assignmentsAsManagedSlots(assignments,tt,subjects,isClass){
  if(!assignments || isClass==null || !subjects) return null;
  const timeTableId = tt.id;
  return Object.entries(assignments).reduce((slotwiseArr,[timeSlotId,{id=null,startTime,endTime,assigned}])=>[
    ...slotwiseArr,
    ...(assigned ? Object.entries(assigned).reduce((arr,[k,{manageId,subjectId}])=>[
      ...arr,
      {
        id: manageId,
        timeTableId,
        timeSlotId,
        startTime,
        endTime,
        [isClass ? "dayOfWeek" : "date"]: k,
        [isClass ? "date" : "dayOfWeek"]: null,
        subjectId,
        shortName: subjects.find(({subjectId: subjId})=>subjId===subjectId)?.shortName
      }
    ],[]) : [])
  ],[]);
}

export default function AssignSlots(props) {
  // const { subjects, classes, timetables, timeslots, manageTimeslots } =
  //   useContext(UserContext);
  const {timetablesAPI,classesAPI,subjectsAPI} = useContext(DBContext);
  const { ttid } = useParams();
  const [tt, setTT] = useState(null);
  const isClass = tt ? tt.timeTableType === "Class" : null;
  const [managedSlots,setManagedSlots] = useState(null);
  const [subjects,setSubjects] = useState(null);
  const [classname, setClassname] = useState("");
  const [assignments, setAssignments] = useState({}); //{tsid:{day/date:{...slot}}}

  useEffect(() => {
    timetablesAPI
      .getSlotsFor({id: ttid})
      .then(([timetable,managedSlotList = []])=>{
        setTT(timetable);
        setManagedSlots(managedSlotList);
      })
  }, [ttid, timetablesAPI]);
  useEffect(() => {
    tt && classesAPI
      .getClassById({id: tt.classId})
      .then(({name})=>setClassname(name));
  }, [tt, classesAPI]);
  useEffect(()=>{
    subjectsAPI
      .get()
      .then((subjectsList)=>setSubjects(subjectsList));
  }, [subjectsAPI]);
  useEffect(()=>{
    if(!subjects || !managedSlots || !managedSlots.length || managedSlots[0].shortName!=null) return;
    setManagedSlots(managedSlotsWithShortNames(managedSlots,subjects));
  },[subjects,managedSlots]);
  
  useEffect(() => {
    if (isClass==null || !managedSlots || (managedSlots.length && managedSlots[0].shortName==null)) return;
    timetablesAPI.slots
      .get()
      .then((slots)=>setAssignments(managedSlotsAsAssignments(managedSlots,slots,isClass)));
  }, [isClass,managedSlots,timetablesAPI]);

  function handlePublish(){
    timetablesAPI
      .assignSlotsFor({
        id: ttid,
        newManagedSlots: assignmentsAsManagedSlots(assignments,tt,subjects,isClass)
      }).then(
        ()=>{console.log("Succesfully assigned slots: ",assignments); alert("Published Successfully!")}
      ).catch(err=>console.log("Error assigning slots: ",err));
  }

  function getEventSources() {
    return [{
      events: assignmentsAsManagedSlots(assignments,tt,subjects,isClass)?.map(
        (slot)=>managedSlotAsEvent(slot).event
      ) ?? [],
      color: isClass ? "#FF8811" : "#8811FF",
    }];
  }

  if (tt == null) return <div>Loading...</div>;
  else return (
    <Box>
      <Box fontSize={"200%"} margin={"0.5%"} paddingLeft={"1%"}>
        Assign Slots for{" "}
        <Link href={`/academics/timetable/view/${ttid}`}>
          {tt?.name ?? "..."}
        </Link>{" "}
        (Class {classname ?? "..."})
      </Box>
      <Divider variant="middle"/>
      <Box paddingRight={"3%"} paddingLeft={"1%"}>
        <Grid container columns={5} columnSpacing={1} margin={"1%"}>
          <Grid item xs={5}>
          <Card sx={{ margin: "1%", padding: "1%" }}>
            <SlotSelector
              isClass={isClass}
              assignments={assignments}
              subjects={subjects}
              setAssignments={setAssignments}
            />
            </Card>
          </Grid>
          <Grid item xs={5}>
            <Card sx={{ width: "100%", padding: "1%" }}>
              <TimetableView eventSources={getEventSources()} classOnly={isClass}/>
              <Box display={"flex"}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginY: "1%", marginX: "auto", width: "40%" }}
                onClick={()=>handlePublish()}
              >
                Publish
              </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
