import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import TimetableView from "../components/TimetableView";
import { useParams } from "react-router-dom";
import DBContext from "../context/DBContext";
import { useAuth } from "../hooks/useAuth";
import html2pdf from 'html2pdf.js';
import { Button } from "@mui/material";

export function managedSlotAsEvent({
  startTime,
  endTime,
  dayOfWeek,
  date,
  shortName
}){
  if(dayOfWeek!=null){
    return {
      isClass: true,
      event: {
        title: `${shortName ?? "..."} (CLASS)`,
        startTime,
        endTime,
        daysOfWeek: [dayOfWeek]
      }
    };
  }else if(date!=null){
    const start = new Date(date);
    start.setHours(...startTime.split(":"));
    const end = new Date(date);
    end.setHours(...endTime.split(":"));
    return {
      isClass: false,
      event: {
        title: `${shortName ?? "..."} (EXAM)`,
        start,
        end
      }
    };
  }else{
    return {isClass: null, event: null};
  }
}

export function managedSlotsWithShortNames(managedSlots,subjects){
  return managedSlots.map(
    (slotData)=>({
      ...slotData,
      shortName: subjects.find(
        ({subjectId})=>(subjectId===slotData.subjectId)
      )?.shortName ?? null
    })
  );
}

export default function SingleTimetable(props) {
  const {user} = useAuth();
  const {my=false} = props;
  const {ttid} = useParams();
  //if my, get user's timetable: both exam and class types -- TODO
  //if ttid, get specific timetable - if exam type, pass the "examOnly" attribute to TimetableView
  const {timetablesAPI,classesAPI,subjectsAPI,getTimetableSlotsForUser} = useContext(DBContext);
  const [slotsData,setSlotsData] = useState([null,null]);
  const [tt,managedSlots = []] = slotsData;
  //[{startTime,endTime,id (managetime record),timeTableId,timeSlotId,dayOfWeek,date,subjectId,shortName}]
  const [className,setClassName] = useState(null);
  const componentRef = useRef();

  useEffect(()=>{
    (my ? 
      getTimetableSlotsForUser(user) : 
      timetablesAPI.getSlotsFor({id: ttid})
    ).then(([tt,managedSlots = []])=>setSlotsData([tt,managedSlots]))
    .catch(err=>{
      console.log("Error fetching timetable: ",err);
      setSlotsData([{name: null},[]]);
    });
  }, [my,user,ttid,timetablesAPI,getTimetableSlotsForUser]);

  useEffect(()=>{
    const [tt,managedSlots = []] = slotsData;

    if(tt && tt.name==null) return;

    if(className==null && tt){
      classesAPI
        .getClassById({id: tt.classId})
        .then(({name})=>setClassName(name));
    }

    if(managedSlots && managedSlots[0]?.shortName==null){
      subjectsAPI
        .get()
        .then((subjects)=>setSlotsData([
          tt,
          managedSlotsWithShortNames(managedSlots,subjects)
        ]))
    }
  },[className,setClassName,classesAPI,subjectsAPI,slotsData]);

  if (tt === null) {
    return <div>Loading...</div>;
  }
  // console.log(slotsData);
  let classEvents = [], examEvents = [];

  managedSlots.forEach((slot)=>{
    const {isClass,event} = managedSlotAsEvent(slot);
    if(event){
      if(isClass) classEvents.push(event);
      else examEvents.push(event);
    }
  });

  const eventSources = [
    { events: classEvents, color: "#FF8811" },
    { events: examEvents, color: "#8811FF" },
  ];

  const handleSavePdf = () => {
    const element = componentRef.current;
    const width = element.offsetWidth, height = element.offsetHeight;

    const opt = {
      margin:       [0.5, 0.2, 0.5, 0.2], // Top, left, bottom, right margins in inches
      filename:     `${tt.name ?? "unnammed"}_timetable.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true, width, height },
      jsPDF:        { unit: 'pt', format: [width+10,height+10], orientation: 'landscape' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Time Table "{tt.name ?? "..."}" for Class {className ?? "..."}</h1>
      <div ref={componentRef} className="w-100 h-100">
        <TimetableView eventSources={eventSources} classOnly={tt.timeTableType==="Class"} />
      </div>
      <div className="w-100 h-100 flex justify">
        <button
          onClick={handleSavePdf}
          className="bg-blue-500 text-white w-30 mx-auto my-5 px-4 py-2 rounded hover:bg-blue-700 mb-4 self-end"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
}
