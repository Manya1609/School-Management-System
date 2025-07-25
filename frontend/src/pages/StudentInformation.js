import React, { useState, useEffect, useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Box, Button, Divider, FormControl, Grid, InputLabel, Select } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DBContext from "../context/DBContext";
import UnifiedManageTable, { newActionItem } from "../components/UnifiedManageTable";

function SelectionForm(props){
    const { onSubmit, onClear } = props;
    const [selectionFormData, setSelectionFormData] = useState({
        classId: "",
        sectionId: "",
    });
    const { classesAPI } = useContext(DBContext);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    useEffect(() => {
        classesAPI.get().then((clss) => setClasses(clss));
    }, [classesAPI]);
    useEffect(() => {
        const id = selectionFormData.classId;
        if (id === "") return;
        classesAPI
            .getSections({ id })
            .then((secs) => setSections(secs));
    }, [selectionFormData.classId, classesAPI]);

    function handleChange(e) {
        e.preventDefault();
        // console.log(e);
        const { name, value } = e.target;
        setSelectionFormData({ ...selectionFormData, [name]: value });
    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(selectionFormData);
            }}
        >
            <Grid container columns={7} columnSpacing={1} padding={"1%"}>
                <Grid item xs>
                    <Grid container columns={4} columnSpacing={1} rowSpacing={1} padding={"1%"}>
                        <Grid item xs={2}>
                            <FormControl fullWidth>
                                <InputLabel>Class</InputLabel>
                                <Select
                                    required
                                    label={"Class"}
                                    name={"classId"}
                                    value={selectionFormData.classId}
                                    onChange={handleChange}
                                >
                                    {classes.map((cls) => (
                                        <MenuItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth>
                                <InputLabel>Section</InputLabel>
                                <Select
                                    label={"Section"}
                                    name={"sectionId"}
                                    value={selectionFormData.sectionId}
                                    onChange={handleChange}
                                    disabled={
                                        sections?.length === 0
                                    }
                                >
                                    {sections.map((sec) => (
                                        <MenuItem key={sec.id} value={sec.id}>
                                            {sec.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1} display={"flex"}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ margin: "auto", width: "80%", height: "80%" }}
                        disabled={Object.values(selectionFormData).every((x) => x === "")}
                    >
                        Go
                    </Button>
                </Grid>
                <Grid item xs={1} display={"flex"}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{ margin: "auto", width: "80%", height: "80%" }}
                        onClick={()=>{
                            setSelectionFormData({
                                classId: "",
                                sectionId: "",
                            });
                            setSections([]);
                            onClear();
                        }}
                        disabled={Object.values(selectionFormData).every((x) => x === "")}
                    >
                        Clear
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default function StudentInformation(){
    const [selectionData,setSelectionData] = useState(null);
    const columns = [
        { field: "photo", headerName: "Photo", width: 140 },
        { field: "fullName", headerName: "Name", width: 290 },
        { field: "admissionNumber", headerName: "Admission #", width: 240 },
        { field: "email", headerName: "Email", width: 290 },
    ];
    const [rows,setRows] = useState([]);
    const {getStudentsWithUserDataFor} = useContext(DBContext);

    useEffect(()=>{
        if(!selectionData){
            setRows([]);
            return;
        }else{
            console.log(selectionData);
            const {classId} = selectionData;
            const sectionId = selectionData.sectionId==="" ? null : selectionData.sectionId;
            getStudentsWithUserDataFor({classId,sectionId})
                .then((studentUsers)=>setRows(studentUsers));
        }
    },[getStudentsWithUserDataFor,selectionData]);

    let actionItems = [
        newActionItem(
            <EditIcon style={{ marginRight: 8 }} />,
            "Edit Profile",
            ({userId})=>{
                window.open(`/user-profile/${userId}`,'_blank')?.focus();
            }
        ),
        newActionItem(
            <CheckIcon style={{ marginRight: 8}} />,
            "Marksheets",
            ()=>{
                window.open("/exams/tabulation-sheet",'_blank')?.focus();
            }
        )
    ];

    const infoTable =(
        <UnifiedManageTable
            dataRecords={rows}
            idParser={(record, index) => record.userId}
            dataColumns={columns}
            searchFields={["fullName", "email"]}
            actionItems={actionItems}
        />
    );
    return <Box marginY={"1%"}>
        <Box paddingX={"5%"}>
            <Box paddingX={"1%"} fontSize={"200%"}>
                Select Class and/or Section
            </Box>
            <SelectionForm onSubmit={setSelectionData} onClear={()=>setSelectionData(null)}/>
        </Box>
        <Divider variant="middle" />
        <Box paddingX={"5%"}>
            {infoTable}
        </Box>
    </Box>
}