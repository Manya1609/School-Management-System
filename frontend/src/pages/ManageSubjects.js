import React, { useState, useContext,useEffect } from 'react';
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import UnifiedManageTable, {
    deleteActionItem,
    editActionItem,
    viewActionItem,
  } from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import AddSubject from '../components/AddSubject'
import ModifySubject from '../components/ModifySubject';

export default function ManageSubjects() {
	const { subjectsAPI, classesAPI, usersAPI } = useContext(DBContext);
	const [subjects, setSubjects] = useState(null);
	const [selectedSubject, setSelectedSubject] = useState(null);

    const columns = [
        { field: 'subjectName', headerName: 'Subject Name', width:240 },
        { field: 'shortName', headerName: 'Short Name', width:240 },
        { field: 'className', headerName: 'Class Name', width:240 },
        { field: 'teacherName', headerName: 'Teacher Name', width:240 },
        { field: 'teacherEmail', headerName: 'Teacher Email', width:240 },
    ];

	async function getSubjects(){
		try{
			let subjectsList = await subjectsAPI.get();
			setSubjects(subjectsList);
		}
		catch(err){
			console.error("There was an error while fetching the subjects!", err)
		}
	}

	async function deleteSubject(id){
		try{
			let response = await subjectsAPI.delete({id});
			console.log("Deleted the Subject", response)
		}
		catch(err){
			console.error("There was an error deleting the subject!", err)
		}
	}

	useEffect(() => {
		getSubjects()
	}, [subjectsAPI, classesAPI, usersAPI]);

    const actionItems = [
        editActionItem((record) => {
          //handle edit subject
          console.log("Edit subject for ", record);
          setSelectedSubject(record)
        }),
        deleteActionItem((record) => {
          //handle delete subject
          console.log("Delete subject for ", record);
		  deleteSubject(record.subjectId);
        }),
    ];

    const manageTable = (
        <UnifiedManageTable
          dataRecords={subjects}
          idParser={(record, index) => record.subjectId}
          dataColumns={columns}
          searchFields={["name", "shortname", "className", "teacherName","teacherEmail"]}
          actionItems={actionItems}
        />
    );

    return (
      <div>
        {selectedSubject ? (<ModifySubject subject={selectedSubject} setSelectedSubject={setSelectedSubject} />) : (
          <TabSwitcher
            heading={"Manage Subjects"}
            rootpath={"subjects"}
            tabs={[
                newTab("create-new-subject", "Create New Subject", <AddSubject />),
                newTab("manage-subjects", "Manage Subjects", manageTable),
            ]}
        />
			  )}
      </div>
        
    );
}