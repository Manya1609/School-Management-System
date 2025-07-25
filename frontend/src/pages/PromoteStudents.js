import React, { useState, useEffect, useContext } from 'react';
import { ComboBox, Item, Flex, Button, View, Text } from '@adobe/react-spectrum';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DBContext from "../context/DBContext";

const PromoteStudents = () => {
    const [classOptions, setClassOptions] = useState([]);
    const [fromSectionOptions, setFromSectionOptions] = useState([]);
    const [toSectionOptions, setToSectionOptions] = useState([]);
    const [fromClass, setFromClass] = useState(null);
    const [fromClassName, setFromClassName] = useState(null);
    const [fromSection, setFromSection] = useState(null);
    const [fromSectionName, setFromSectionName] = useState(null);
    const [toClass, setToClass] = useState(null);
    const [toClassName, setToClassName] = useState(null);
    const [toSection, setToSection] = useState(null);
    const [toSectionName, setToSectionName] = useState(null);
    const [rows, setRows] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
	const { sectionsAPI, classesAPI, usersAPI, studentsAPI } = useContext(DBContext);


    async function getClasses(){
		try{
			let classesList = await classesAPI.get();
			setClassOptions(classesList);
		}
		catch(err){
			console.error("There was an error while fetching the classes!", err)
		}
	}


    async function getSections(classId, qualifier){
		try{
			let sectionsList = await sectionsAPI.getSectionsByClass({classId});
            if(qualifier === "from"){
                setFromSectionOptions(sectionsList)
            }
            else if(qualifier === "to"){
                setToSectionOptions(sectionsList)
            }
		}
		catch(err){
			console.error("There was an error while fetching the sections!", err)
		}
	}

    async function getClassSectionStudentList(classId, sectionId){
        try{
            let classSectionStudentList = await classesAPI.getClassSectionStudents({classId, sectionId});
            return classSectionStudentList;
        }
        catch(err){
            console.log("There was an error fetching student List!",err);
            return null;
        }
    }

    async function handleBulkSubmit(){
        let classSectionStudentList = await getClassSectionStudentList(fromClass, fromSection);
        let userIdArray = classSectionStudentList.map(student => student.userId);
        let trueArray = classSectionStudentList.map(() => true);

        let formData = {
            fromClassId: fromClass,
            fromSectionId: fromSection,
            toClassId: toClass,
            toSectionId: toSection,
            studentIdList: userIdArray,
            promoted: trueArray
        }

        try{
            let response = await studentsAPI.promote(formData)
            alert("Students promoted successfully!");
        }
        catch(err){
            console.error("There was an error while promoting", err)
        }
    }

    async function getStudentName(userId) {
        let userObj = await usersAPI.getUserById({userId});
        return userObj.fullName;
    }


    async function generateRows(){
        let classSectionStudentList = await getClassSectionStudentList(fromClass, fromSection);
        setStudentsList(classSectionStudentList);

        let newRows=[]; let i=1;
        for(let student of classSectionStudentList){
            let studentFullName = await getStudentName(student.userId);
            newRows.push({id:i, name: studentFullName, currentSession: "2023-2024", action:''});
            i++;
        }
        setRows(newRows)
    }


    async function handleCustomSubmit(){
        let userIdArray = studentsList.map(student => student.userId);
        const trueArray = rows.map(row => {
            if (row.action === 'promote') {
                return true; 
            } else if (row.action === 'dontPromote') {
                return false; 
            }
            return undefined;
        });

        let formData = {
            fromClassId: fromClass,
            fromSectionId: fromSection,
            toClassId: toClass,
            toSectionId: toSection,
            studentIdList: userIdArray,
            promoted: trueArray
        }

        try{
            let response = await studentsAPI.promote(formData)
            alert("Students promoted successfully!");
        }
        catch(err){
            console.error("There was an error while promoting", err)
        }
    }

    useEffect(() => {
        getClasses();
    }, [classesAPI]);

    useEffect(() => {
        if(fromClass){
            getSections(fromClass, "from");
        }
    },[fromClass, sectionsAPI])

    useEffect(() => {
        if(toClass){
            getSections(toClass, "to")
        }
    },[toClass, sectionsAPI])

    useEffect(() => {
        if(fromClassName && fromSectionName && toClassName && toSectionName){
            generateRows();
        }
    },[fromClassName, fromSectionName, toClassName, toSectionName])


    const columns = [
        {
            field: 'id',
            headerName: 'S/N',
            width: 90,
            valueGetter: (params) => params.row ? params.row.id : '',
            renderCell: (params) => params.row.id
        },
        { field: 'name', headerName: 'Name', width: 390 },
        { field: 'currentSession', headerName: 'Current Session', width: 290 },
        {
            field: 'action',
            headerName: 'Action',
            width: 340,
            renderCell: (params) => (
                <ComboBox
                    aria-label="Select promotion action"
                    defaultItems={[
                        { id: 'promote', name: 'Promote' },
                        { id: 'dontPromote', name: "Don't Promote" },
                    ]}
                    selectedKey={params.row.action}
                    onSelectionChange={(key) => {
                        const updatedRows = rows.map((row) =>
                            row.id === params.row.id ? { ...row, action: key } : row
                        );
                        setRows(updatedRows);
                    }}
                    width="size-3000"
                >
                    {(item) => <Item key={item.id}>{item.name}</Item>}
                </ComboBox>
            ),
        },
    ];

    return (
        <View padding="size-200" backgroundColor="white" UNSAFE_style={{ marginTop: '10px', backgroundColor: 'white' }}>
            {/* Main Heading */}
            <Flex direction="row" alignItems="center" justifyContent="space-between" marginBottom="size-200">
                <Text elementType="h1" UNSAFE_style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                    Student Promotion
                </Text>
                <Flex alignItems="center" direction="column">
                    <ArrowDownwardIcon style={{ fontSize: '24px', color: '#000000' }} />
                    <Text elementType="span" UNSAFE_style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', marginTop: '4px' }}>
                        Current Session : 2023-2024
                    </Text>
                </Flex>
            </Flex>

            <Flex direction="column" gap="size-100">
                {/* Promotion Box */}
                <View padding="size-200" backgroundColor="white" borderRadius="medium" borderColor="gray-300" borderWidth="thin">
                    <Flex direction="row" alignItems="center" justifyContent="space-between" marginBottom="size-200">
                        <Text elementType="h2" UNSAFE_style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>
                            Student Promotion from <span style={{ color: '#0078D4' }}>2023-2024</span> to <span style={{ color: '#D83B01' }}>2024-2025</span> Session
                        </Text>
                        <IconButton onClick={() => console.log('Close')}>
                            <CloseIcon />
                        </IconButton>
                    </Flex>
                    <Flex direction="row" wrap="wrap" gap="size-200" marginBottom="size-150">
                        <Flex direction="row" alignItems="center" gap="size-100" marginBottom="size-200" UNSAFE_style={{marginRight: '36px'}}>
                            <Text>From Class:</Text>
                            <ComboBox
                                aria-label="From Class"
                                defaultItems={classOptions}
                                onSelectionChange={(key) => {
                                    const selectedClass = classOptions.find(option => option.id === Number(key));
                                    if (selectedClass) {
                                        setFromClass(key); 
                                        setFromClassName(selectedClass.name);
                                    }
                                }}
                                width="size-2400"
                            >
                                {item => <Item key={item.id}>{item.name}</Item>}
                            </ComboBox>
                        </Flex>
                        <Flex direction="row" alignItems="center" gap="size-100" marginBottom="size-150" UNSAFE_style={{marginRight: '36px'}}>
                            <Text>From Section:</Text>
                            <ComboBox
                                aria-label="From Section"
                                defaultItems={fromSectionOptions}
                                onSelectionChange={(key) => {
                                    const selectedSection = fromSectionOptions.find(option => option.id === Number(key));
                                    if (selectedSection) {
                                        setFromSection(key); 
                                        setFromSectionName(selectedSection.name);
                                    }
                                }}
                                width="size-2400"
                            >
                                {item => <Item key={item.id}>{item.name}</Item>}
                            </ComboBox>
                        </Flex>
                        <Flex direction="row" alignItems="center" gap="size-100" marginBottom="size-150" UNSAFE_style={{marginRight: '36px'}}>
                            <Text>To Class:</Text>
                            <ComboBox
                                aria-label="To Class"
                                defaultItems={classOptions}
                                onSelectionChange={(key) => {
                                    const selectedClass = classOptions.find(option => option.id === Number(key));
                                    if (selectedClass) {
                                        setToClass(key); 
                                        setToClassName(selectedClass.name);
                                    }
                                }}
                                width="size-2400"
                            >
                                {item => <Item key={item.id}>{item.name}</Item>}
                            </ComboBox>
                        </Flex>
                        <Flex direction="row" alignItems="center" gap="size-100" marginBottom="size-150" UNSAFE_style={{marginRight: '36px'}}>
                            <Text>To Section:</Text>
                            <ComboBox
                                aria-label="To Section"
                                defaultItems={toSectionOptions}
                                onSelectionChange={(key) => {
                                    const selectedSection = toSectionOptions.find(option => option.id === Number(key));
                                    if (selectedSection) {
                                        setToSection(key); 
                                        setToSectionName(selectedSection.name);
                                    }
                                }}
                                width="size-2400"
                            >
                                {item => <Item key={item.id}>{item.name}</Item>}
                            </ComboBox>
                        </Flex>
                        <Flex direction="row" alignItems="center" justifyContent="center" width="100%" marginTop="size-60">
                            <Button variant="cta" UNSAFE_style={{ fontSize: '14px', borderRadius: '4px', margin: '0 16px' }} onPress={handleBulkSubmit}>
                                Manage Promotion
                                <SendIcon style={{ marginLeft: '8px', transform: 'rotate(-45deg)', fontSize: '18px', verticalAlign: 'middle' }} />
                            </Button>
                        </Flex>
                    </Flex>
                </View>

                {/* Spacer */}
                <div style={{ height: '20px' }}></div>

                {/* DataGrid Box  */}
                <View padding="size-200" backgroundColor="white" borderRadius="medium" borderColor="gray-300" borderWidth="thin">
                    <Flex direction="row" alignItems="center" justifyContent="space-between" marginBottom="size-200">
                        <Text elementType="h2" UNSAFE_style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000', marginBottom: '20px' }}>
                            Promote students from <span style={{ color: '#446a04' }}>{fromClass ? fromClassName : 'Select Class'}, {fromSection ? fromSectionName : 'Select Section'}</span> to <span style={{ color: '#50129c' }}>{toClass ? toClassName : 'Select Class'}, {toSection ? toSectionName : 'Select Section'}</span>
                        </Text>
                    </Flex>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns} pageSize={5} />
                    </div>
                    <Flex justifyContent="center" marginTop="size-200">
                        <Button variant="cta" UNSAFE_style={{ fontSize: '14px', borderRadius: '4px' }} onPress={handleCustomSubmit}>
                            <TrendingUpIcon style={{ marginRight: '8px' }} />
                            Promote Students
                        </Button>
                    </Flex>
                </View>
            </Flex>
        </View>
    );
};

export default PromoteStudents;
