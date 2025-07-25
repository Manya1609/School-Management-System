import React, { useRef, useEffect, useState, useContext } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import DBContext from "../context/DBContext";

function hyphenatedDateStr(timestamp) {
  return timestamp.toJSON().split("T")[0];
}
function truncated(s, maxLen = 100) {
  if (s.length < maxLen) return s;
  else return s.slice(0, maxLen-3) + "...";
}

const GridCalendar = () => {
  const {noticesAPI} = useContext(DBContext);
  const calendarRef = useRef(null);
  const [resizeToggle, setResizeToggle] = useState(false);
  const [calendarNotices, setCalendarNotices] = useState([]); // [{id,title,dueDate}]

  window.addEventListener("resize", () => setResizeToggle(!resizeToggle));

  useEffect(() => {
    if (calendarRef.current) {
      let events = calendarNotices.map(({id,title,dueDate}) => ({
        id,
        title: truncated(title, 20),
        start: dueDate
      }));
      const calendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        },
        events,
        eventClick: ({event})=>{
          window.open(`/notices/view/${event.id}`,'_blank');
        }
      });
      calendar.render();
    }
  }, [resizeToggle, calendarNotices]);

  useEffect(() => {
    noticesAPI.get()
      .then((data) => {
        setCalendarNotices(data);
      });
    setResizeToggle(true);
  }, [noticesAPI]);

  return (
    <div
      id="calendar"
      ref={calendarRef}
      style={{
        padding: "2%",
        minWidth: "300px",
        width: "50vw",
        maxHeight: "70vh",
        fontSize: "0.8vw", // Adjust the font size if needed
      }}
    ></div>
  );
};

export default GridCalendar;
