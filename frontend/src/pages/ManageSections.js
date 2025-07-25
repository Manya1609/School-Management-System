import React, { useState, useContext, useEffect } from 'react';
// import { UserContext } from "../context/UserContext";
import DBContext from "../context/DBContext";
import UnifiedManageTable, {
    deleteActionItem,
    editActionItem,
    viewActionItem,
  } from "../components/UnifiedManageTable";
import TabSwitcher, { newTab } from "../components/TabSwitcher";
import AddSection from '../components/AddSection'
import ModifySection from '../components/ModifySection';


export default function ManageSections() {
	const { sectionsAPI, classesAPI, usersAPI } = useContext(DBContext);
	const [sections, setSections] = useState(null);
	const [selectedSection, setSelectedSection] = useState(null);

    const columns = [
        { field: 'name', headerName: 'Name', width: 400 },
        { field: 'className', headerName: 'Class Name', width: 400 },
        { field: 'teacherName', headerName: 'Teacher Name', width: 400 },
    ];


    async function getSections(){
		try{
			let sectionsList = await sectionsAPI.get();
            let newSectionsList=[];
            for(let sectionData of sectionsList){
                let clazz = await classesAPI.getClassById({id: sectionData.classId})
                let className = clazz.name;
                
                let teacher = await usersAPI.getUserById({userId: sectionData.userId})
                let teacherName = teacher.fullName;


                newSectionsList.push({id:sectionData.id, name: sectionData.name, className: className, teacherName: teacherName})
            }
			// console.log(newSectionsList)
			setSections(newSectionsList);
		}
		catch(err){
			console.error("There was an error while fetching the sections!", err)
		}
	}

	async function deleteSection(id){
		try{
			let response = await sectionsAPI.delete({id});
			console.log("Deleted the Section", response)
		}
		catch(err){
			console.error("There was an error deleting the section!", err)
		}
	}

	useEffect(() => {
		getSections()
	}, [sectionsAPI, classesAPI, usersAPI]);


    const actionItems = [
        editActionItem((record) => {
          //handle edit section
          console.log("Edit section for ", record);
		  setSelectedSection(record)
        }),
        deleteActionItem((record) => {
          //handle delete section
          console.log("Delete section for ", record);
		  deleteSection(record.id);
        }),
    ];

    const manageTable = (
        <UnifiedManageTable
          dataRecords={sections}
          idParser={(record, index) => record.id}
          dataColumns={columns}
          searchFields={["name", "className", "teacherName"]}
          actionItems={actionItems}
        />
    );

    

    return (
		<div>
			{selectedSection ? (<ModifySection section={selectedSection} setSelectedSection={setSelectedSection} />) : (
				<TabSwitcher
				heading={"Manage Sections"}
				rootpath={"sections"}
				tabs={[
					newTab("create-new-section", "Create New Section", <AddSection />),
					newTab("manage-sections", "Manage Sections", manageTable),
				]}
			/>
			)}
        </div>

    );
}