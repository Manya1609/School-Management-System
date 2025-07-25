import React, { useState, useContext, useEffect } from 'react';
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import UnifiedManageTable, {
    deleteActionItem,
    editActionItem,
    viewActionItem,
  } from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import AddExam from "../components/AddExam"
import ModifyExam from '../components/ModifyExam';

export default function ManageExamList() {
	const { examsAPI } = useContext(DBContext);
	const [exams, setExams] = useState(null);
	const [selectedExam, setSelectedExam] = useState(null);

	async function getExams(){
		try{
			let examList = await examsAPI.get();
			setExams(examList);
		}
		catch(err){
			console.error("There was an error while fetching the exams!", err)
		}
	}

	async function deleteExam(id){
		try{
			let response = await examsAPI.delete({id});
			console.log("Deleted the Exam", response)
		}
		catch(err){
			console.error("There was an error deleting the exam!", err)
		}
	}

	useEffect(() => {
		getExams()
	}, [examsAPI]);

    const columns = [
        { field: 'name', headerName: 'Name', width:600 },
        { field: 'term', headerName: 'Term', width:600 },
    ];

    const actionItems = [
        editActionItem((record) => {
          //handle edit notice
          console.log("Edit exam for ", record);
          setSelectedExam(record)
        }),
        deleteActionItem((record) => {
          //handle delete notice
          console.log("Delete exam for ", record);
		  deleteExam(record.id);
        }),
    ];

    const manageTable = (
        <UnifiedManageTable
          dataRecords={exams}
          idParser={(record, index) => record.id}
          dataColumns={columns}
          searchFields={["name", "term"]}
          actionItems={actionItems}
        />
    );

    return (
      <div>
        {selectedExam ? (<ModifyExam exam={selectedExam} setSelectedExam={setSelectedExam}/>) : (
                  <TabSwitcher
            heading={"Manage Exams"}
            rootpath={"exams/exam-list"}
            tabs={[
              newTab("add-new-exam", "Add New Exam", <AddExam />),
              newTab("manage-exams", "Manage Exams", manageTable),
            ]}
          />
              )}
      </div>
        
    );
}