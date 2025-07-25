import React, { useState, useEffect, useContext } from "react";
import NoticeForm from "../components/NoticeForm";
import UnifiedManageTable, {
  deleteActionItem,
  editActionItem,
  usePopupWithActionItem,
  viewActionItem,
} from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import DBContext from "../context/DBContext";
import { useNavigate } from "react-router-dom";

export default function ManageNotices() {
  const {noticesAPI} = useContext(DBContext);
  const [popupEditActionItem,editPopupTrigger] = usePopupWithActionItem(
    editActionItem((record)=>console.log("Editing notice: ",record)),
    "Editing Notice",
    (record,triggerClose) => <NoticeForm noticeData={record} onSubmit={triggerClose} />
  )
  const columns = [
    { field: "title", headerName: "Title", width: 400 },
    { field: "content", headerName: "Content", width: 600 },
    { field: "dueDate", headerName: "Date", width: 200 },
  ];
  const [rows,setRows] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    console.log("Fetching notices");
    noticesAPI
      .get()
      .then((fetchedNotices)=>{
        if(fetchedNotices[0]?.dueDate?.indexOf('T') !== -1){
          fetchedNotices = fetchedNotices.map((notice)=>({
            ...notice,
            dueDate: notice.dueDate?.split('T')?.[0]
          }))
        }
        console.log(fetchedNotices);
        setRows(fetchedNotices);
      })
      .catch((err)=>console.log("Error fetching notices: ",err));
  },[noticesAPI]);

  let actionItems = [
    viewActionItem("Notice", (record) => {
      navigate(`/notices/view/${record.id}`,{replace: true});
    }),
    popupEditActionItem,
    deleteActionItem(({id}) => {
      noticesAPI
        .delete({id})
        .then((data)=>console.log("Deleted notice successfully: ",data))
        .catch((err)=>console.log("Error in deleting notice: ",err));
    }),
  ];

  let manageTable = (
    <>
      <UnifiedManageTable
        dataRecords={rows}
        idParser={(record, index) => record.noticeId}
        dataColumns={columns}
        searchFields={["title", "body"]}
        actionItems={actionItems}
      />
      {editPopupTrigger}
    </>
  );

  return (
    <TabSwitcher
      heading={"Manage Notices"}
      rootpath={"notices"}
      tabs={[
        newTab("create-new-notice", "Create New Notice", <NoticeForm />),
        newTab("manage-notices", "Manage Notices", manageTable),
      ]}
    />
  );
}
