import React, { useState, useEffect, useContext } from "react";
import UnifiedManageTable, {
  deleteActionItem,
  editActionItem,
  usePopupWithActionItem,
} from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import SlotsForm from "../components/SlotsForm";
import DBContext from "../context/DBContext";

export default function ManageSlots() {
  const {timetablesAPI} = useContext(DBContext);
  const [rows,setRows] = useState([]);
  const [popupEditActionItem,editPopupTrigger] = usePopupWithActionItem(
    editActionItem((record) => console.log("Editing timeslot: ", record)),
    "Editing Timeslot",
    (record,triggerClose) => <SlotsForm slotData={record} onSubmit={triggerClose} />
  )
  const columns = [
    { field: "startTime", headerName: "Start Time", width: 550 },
    { field: "endTime", headerName: "End Time", width: 550 },
  ];

  useEffect(()=>{
    timetablesAPI.slots
      .get()
      .then((slots)=>{
        slots.sort((slot1,slot2)=>{
          if(slot1.startTime<slot2.startTime) return -1;
          else if(slot1.startTime>slot2.startTime) return 1;
          else{
            if(slot1.endTime<slot2.endTime) return -1;
            else if(slot1.endTime>slot2.endTime) return 1;
            else return 0;
          }
        })
        setRows(slots)
      });
  },[timetablesAPI]);

  let actionItems = [
    popupEditActionItem,
    deleteActionItem((record) => {
      //handle delete timeslot
      timetablesAPI.slots
        .delete({id: record.id})
        .then((data)=>console.log("Deleted timeslot: ", data))
        .catch((err)=>console.log("Error deleting timeslot: ", err));
    }),
  ];

  let manageTable = (
    <>
      <UnifiedManageTable
        dataRecords={rows}
        dataColumns={columns}
        searchFields={["start", "end"]}
        actionItems={actionItems}
      />
      {editPopupTrigger}
    </>
  );

  return (
    <TabSwitcher
      heading={`Manage Time Slots`}
      rootpath={"slots"}
      tabs={[
        newTab(
          "create-new-slots",
          "Create New Slots",
          <SlotsForm />
        ),
        newTab("manage-slots", "Manage Slots", manageTable),
      ]}
    />
  );
}
