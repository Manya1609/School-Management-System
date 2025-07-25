import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function TimetableView(props) {
  let { eventSources, classOnly } = props;

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
      initialView={classOnly ? "timeGridWeek" : "dayGridMonth"}
      eventSources={eventSources}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridDay,timeGridWeek,dayGridMonth",
      }}
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="18:00:00"
      height="auto"
    />
  );
}
