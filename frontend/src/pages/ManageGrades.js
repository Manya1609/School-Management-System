import React, { useState, useContext, useEffect } from 'react';
import DBContext from "../context/DBContext";
// import { UserContext } from "../context/UserContext";
import UnifiedManageTable, {
    deleteActionItem,
    editActionItem,
    viewActionItem,
  } from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import AddGrade from "../components/AddGrade"
import ModifyGrade from '../components/ModifyGrade';

export default function ManageClasses() {
	const { gradesAPI } = useContext(DBContext);
	const [grades, setGrades] = useState(null);
	const [selectedGrade, setSelectedGrade] = useState(null);


	async function getGrades(){
		try{
			let gardesList = await gradesAPI.get();
			setGrades(gardesList);
		}
		catch(err){
			console.error("There was an error while fetching the gardes!", err)
		}
	}

	async function deleteGrade(id){
		try{
			let response = await gradesAPI.delete({id});
			console.log("Deleted the Grade", response)
		}
		catch(err){
			console.error("There was an error deleting the grade!", err)
		}
	}

	useEffect(() => {
		getGrades()
	}, [gradesAPI]);

    const columns = [
        { field: 'gradeName', headerName: 'Grade Name', width:300 },
        { field: 'gradeType', headerName: 'Grade Type', width:300 },
        { field: 'gradeRange', headerName: 'Grade Range', width:300 },
        { field: 'gradeRemark', headerName: 'Grade Remark', width:300 },
    ];

    const actionItems = [
        editActionItem((record) => {
          //handle edit notice
          console.log("Edit grade for ", record);
          setSelectedGrade(record)
        }),
        deleteActionItem((record) => {
          //handle delete notice
          console.log("Delete grade for ", record);
		  deleteGrade(record.gradeId);
        }),
    ];

    const manageTable = (
        <UnifiedManageTable
          dataRecords={grades}
          idParser={(record, index) => record.gradeId}
          dataColumns={columns}
          searchFields={["gradeName", "gradeType", "gradeRange", "gradeRemark"]}
          actionItems={actionItems}
        />
    );

    return (
		<div>
			{selectedGrade ? (<ModifyGrade grade={selectedGrade} setSelectedGrade={setSelectedGrade} />) : (
				<TabSwitcher
					heading={"Manage Grades"}
					rootpath={"exams/grades"}
					tabs={[
						newTab("add-new-grade", "Add New Grades", <AddGrade />),
						newTab("manage-grades", "Manage Grades", manageTable),
					]}
				/>
			)}
        </div>
        
    );
}