import React, { useState, useEffect, useContext } from "react";
import UnifiedManageTable, {
  deleteActionItem,
  editActionItem,
  newActionItem,
  usePopupWithActionItem,
  viewActionItem,
} from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import TimetableForm from "../components/TimetableForm";
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";

export default function ManageTimetables() {
  const {classesAPI,timetablesAPI} = useContext(DBContext);
  const [popupEditActionItem,editPopupTrigger] = usePopupWithActionItem(
    editActionItem((record)=>console.log("Editing timetable: ",record)),
    "Editing Timetable",
    (record,triggerClose)=><TimetableForm timetableData={record} onSubmit={triggerClose} />
  )
  const [rows,setRows] = useState([]);
  const navigate = useNavigate();
  const columns = [
    { field: "name", headerName: "Name", width: 400 },
    { field: "class", headerName: "Class", width: 600 },
    { field: "timeTableType", headerName: "Type", width: 200 },
  ];
  
  useEffect(()=>{
    Promise.all([
      classesAPI.get(),
      timetablesAPI.get()
    ]).then(([classes,timetables])=>{
      const classNames = classes.reduce(((map,{id,name})=>({...map,[id]:name})),{});
      setRows(timetables.map(tt=>({...tt,class:classNames[tt.classId]})));
    })
  },[classesAPI,timetablesAPI]);

  let actionItems = [
    viewActionItem("Timetable", (record) => {
      //handle view timetable
    //   console.log("View timetable for ", record);
      navigate(`/academics/timetable/view/${record.id}`,{replace: true});
    }),
    newActionItem(
    <SettingsIcon style={{ marginRight: 8 }} />,
      "Assign Slots",
      (record) => {
        navigate(`/academics/timetable/assign/${record.id}`,{replace: true});
      }
    ),
    popupEditActionItem,
    deleteActionItem((record) => {
      //handle delete timetable
      timetablesAPI
        .delete({id: record.id})
        .then((data)=>console.log("Deleted timetable: ", data))
        .catch((err)=>console.log("Error in deleting timetable: ",err));
    }),
  ];

  let manageTable = (
    <>
    <UnifiedManageTable
      dataRecords={rows}
      dataColumns={columns}
      searchFields={["name", "class"]}
      actionItems={actionItems}
    />
    {editPopupTrigger}
    </>
  );

  return (
    <TabSwitcher
      heading={"Manage Timetables"}
      rootpath={"academics/timetable"}
      tabs={[
        newTab(
          "create-new-timetable",
          "Create New Timetable",
          <TimetableForm />
        ),
        newTab("manage-timetables", "Manage Timetables", manageTable),
      ]}
    />
  );
}
