import React, { useState, useContext, useEffect } from 'react';
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import UnifiedManageTable, {
    deleteActionItem,
    editActionItem,
  } from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import AddClass from '../components/AddClass'
import ModifyClass from '../components/ModifyClass';

export default function ManageClasses() {
	// const { classes, selectedClass, setSelectedClass, deleteClass } = useContext(UserContext);
	const { classesAPI } = useContext(DBContext);
	const [classes, setClasses] = useState(null);
	const [selectedClass, setSelectedClass] = useState(null);

	async function getClasses(){
		try{
			let classesList = await classesAPI.get();
			setClasses(classesList);
		}
		catch(err){
			console.error("There was an error while fetching the classes!", err)
		}
	}

	async function deleteClass(id){
		try{
			let response = await classesAPI.delete({id});
			console.log("Deleted the Class", response)
		}
		catch(err){
			console.error("There was an error deleting the class!", err)
		}
	}

	useEffect(() => {
		getClasses()
	}, [classesAPI]);

    const columns = [
        { field: 'name', headerName: 'Name', width:600 },
        { field: 'classType', headerName: 'Class Type', width:600 },
    ];

    const actionItems = [
        editActionItem((record) => {
          //handle edit notice
          console.log("Edit class for ", record);
		  setSelectedClass(record);
        }),
        deleteActionItem((record) => {
          //handle delete notice
          console.log("Delete class for ", record);
		  deleteClass(record.id);
        }),
    ];

    const manageTable = (
        <UnifiedManageTable
          dataRecords={classes}
          idParser={(record, index) => record.notice_id}
          dataColumns={columns}
          searchFields={["name", "classType"]}
          actionItems={actionItems}
        />
    );

    return (
		<div>
			{selectedClass ? (<ModifyClass clazz={selectedClass} setSelectedClass={setSelectedClass} />) : (
                <TabSwitcher
					heading={"Manage Classes"}
					rootpath={"classes"}
					tabs={[
						newTab("create-new-class", "Create New Class", <AddClass />),
						newTab("manage-classes", "Manage Classes", manageTable),
					]}
				/>
            )}
		</div>
        
    );
}