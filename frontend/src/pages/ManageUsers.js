import React, { useContext, useEffect, useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import AddUser from "../components/AddUser";
import ModifyUser from "../components/ModifyUser";
import UserCard from "../components/UserCard";
import UnifiedManageTable, {
  deleteActionItem,
  editActionItem,
  newActionItem,
  usePopupWithActionItem,
  viewActionItem,
} from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import { useDispatch } from "react-redux";
import { decrement, increment } from "../reducers/adminCounter";
import DBContext from "../context/DBContext";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export default function ManageUsers() {
  const { getManagedUsers, removeManagedUser } = useContext(DBContext);
  const [popupResetActionItem,resetPopupTrigger] = usePopupWithActionItem(
    newActionItem(
      <LockIcon style={{ marginRight: 8 }} />,
      "Reset Password",
      (record) => console.log("Resetting password for: ",record)
    ),
    "Resetting Password",
    ({username},triggerClose) => <ResetPasswordForm username={username} onSubmit={triggerClose} />
  )
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionTaken, setActionTaken] = useState(null);
  const [currentTab, setCurrentTab] = useState("manage-users"); // State for current tab

  // redux dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    getManagedUsers().then((data) => setUsers(data));
  }, [getManagedUsers]);

  const columns = [
    { field: "fullName", headerName: "Name", width: 300 },
    { field: "username", headerName: "Username", width: 250 },
    { field: "phone", headerName: "Phone", width: 200 },
    { field: "email", headerName: "Email", width: 300 },
  ];

  const actionItems = [
    viewActionItem("User", (record) => {
      console.log("View user for ", record);
      setSelectedUser(record);
      setActionTaken("view");
    }),
    popupResetActionItem,
    editActionItem((record) => {
      console.log("Edit user for (from manage users) ", record);
      setSelectedUser(record);
      setActionTaken("edit");
    }),
    deleteActionItem((record) => {
      console.log("Delete user for ", record);
      if(record.role !== "super_admin"){
        removeManagedUser(record)
          .then((data) => {
            console.log("User deleted successfully: ", data);
            dispatch(increment());
          })
          .catch((err) => {
            console.error("There was an error deleting the user! ", err);
            dispatch(decrement());
          });
      }
      else{
        alert("Super Admin cannot be deleted")
      }
    }),
  ];

  const manageTable = (
    <>
      <UnifiedManageTable
        dataRecords={users}
        idParser={(record, index) => record.userId}
        dataColumns={columns}
        searchFields={["fullName", "username", "email"]}
        actionItems={actionItems}
        filename="Users" // Pass the filename prop
      />
      {resetPopupTrigger}
    </>
  );

  return (
    <div style={{ marginTop: "-80px" }}>
      {/* Adjusted margin to shift the entire page upwards */}
      {/* Always render the heading based on the current tab */}
      <h1>
        {currentTab === "manage-users" ? "Manage Users" : "Create New User"}
      </h1>
      {selectedUser ? (
        <div style={{ marginTop: "80px" }}>
          {" "}
          {/* Adjusted margin to shift the content downwards */}
          {actionTaken === "edit" ? (
            <ModifyUser user={selectedUser} setSelectedUser={setSelectedUser}/>
          ) : (
            <UserCard user={selectedUser} setSelectedUser={setSelectedUser}/>
          )}
        </div>
      ) : (
        <div>
          <TabSwitcher
            heading={
              currentTab === "manage-users" ? "Manage Users" : "Create New User"
            }
            rootpath={"users"}
            tabs={[
              newTab(
                "create-new-user",
                "Create New User",
                <AddUser />,
                () => setCurrentTab("create-new-user")
              ),
              newTab(
                "manage-users",
                "Manage Users",
                manageTable,
                () => setCurrentTab("manage-users")
              )
            ]}
          />
        </div>
      )}
    </div>
  );
}
