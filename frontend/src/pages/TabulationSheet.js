import React, { useState, useEffect, useContext } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Box,
    Typography
} from '@mui/material';
import { DataGrid, renderActionsCell } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';
import SendIcon from '@mui/icons-material/Send';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DBContext from '../context/DBContext';
import { ActionButton, ButtonGroup, Content, Dialog, DialogTrigger, Divider, Heading, Button as SpectrumButton } from '@adobe/react-spectrum';
import Marksheet from '../components/Marksheet';

function SelectionForm(props){
    const { onSubmit } = props;
    const [selectionFormData, setSelectionFormData] = useState({
      classId: "",
      sectionId: "",
      examId: "",
    });
    const { classesAPI, examsAPI } = useContext(DBContext);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [exams, setExams] = useState([]);
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
    useEffect(() => {
      examsAPI.get().then((exs) => setExams(exs));
    }, [examsAPI]);
    // if (classes == null || exams == null || exams == null)
    //   return <div>Loading...</div>;
  
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
            <Grid container columns={6} columnSpacing={1} rowSpacing={1} padding={"1%"}>
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
                    required
                    label={"Section"}
                    name={"sectionId"}
                    value={selectionFormData.sectionId}
                    onChange={handleChange}
                    disabled={
                      selectionFormData.classId === "" || sections?.length === 0
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
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Exam</InputLabel>
                  <Select
                    required
                    label={"Exam"}
                    name={"examId"}
                    value={selectionFormData.exam}
                    onChange={handleChange}
                    disabled={
                      selectionFormData.classId === "" || exams?.length === 0
                    }
                  >
                    {exams.map((ex) => (
                      <MenuItem key={ex.id} value={ex.id}>
                        {ex.name} ({ex.term})
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
              disabled={Object.values(selectionFormData).some((x) => x === "")}
            >
              Go
            </Button>
          </Grid>
        </Grid>
      </form>
    );
}

function MarksheetPopup(props){
    const {marksheetData,closePopup} = props;
    return <DialogTrigger 
      type={"fullscreen"}
      isDismissable={true}
      isOpen={marksheetData!=null}
      onOpenChange={(isOpen)=>isOpen || closePopup()}
    >
        <ActionButton isHidden />
        {(handleClose) => marksheetData && (
            <Dialog>
                <Heading>Marksheet</Heading>
                <Divider />
                <Content>
                    <Marksheet marksheetData={marksheetData}/>
                </Content>
                <ButtonGroup>
                    <SpectrumButton onPress={handleClose}>Close</SpectrumButton>
                </ButtonGroup>
            </Dialog>
        )}
    </DialogTrigger>;
}

function getColumns(subjCols=[]){
    return [
        { field: 'id', headerName: 'S.No.', width: 90 },
        { field: 'name', headerName: 'Student Name', width: 200 },
        { field: 'admNo', headerName: 'Admission #', width: 150 },
        ...subjCols,
        { field: 'total', headerName: 'Total Marks', width: 150 },
        { field: 'average', headerName: 'Average Marks', width: 150 },
        { field: 'position', headerName: 'Position', width: 90 },
        {
            field: 'action',
            headerName: 'Action',
            width: 180,
            renderCell: ({value: setMarksheetData})=><Box width={"90%"}>
                <Button variant='contained' color='primary' onClick={()=>setMarksheetData()}>
                    Marksheet
                    <SendIcon style={{ marginLeft: '8px', transform: 'rotate(-45deg)', fontSize: '18px', marginBottom: "3px" }} />
                </Button>
            </Box>
        }
    ];
}

function TabulationSheet(props){
    const [selectionData,setSelectionData] = useState(null);
    const [rows, setRows] = useState([]);
    const [columns,setColumns] = useState(getColumns());
    const [popupData,setPopupData] = useState(null);
    const {getAllMarksheetData} = useContext(DBContext);

    useEffect(()=>{
        if(!selectionData) return;
        const {classId,sectionId,examId} = selectionData;
        getAllMarksheetData(classId,sectionId,examId)
            .then((allMarksheetData)=>{
                console.log("Marksheet data list: ",allMarksheetData);
                if(!allMarksheetData.length) return;
                const subField = (id)=>`subject-${id}`;
                const subjectCols = allMarksheetData[0].marksData.subjectWise.map(
                    ({subjectId,shortName})=>({
                        field: subField(subjectId),
                        headerName: shortName,
                        width: 90
                    })
                );
                setColumns(getColumns(subjectCols));
                setRows(allMarksheetData.map((marksheetData,i)=>({
                    action: ()=>setPopupData(marksheetData),
                    id: i,
                    ...marksheetData.marksData.subjectWise.reduce(
                        (scoreMap,{subjectId,totalScore})=>({
                            ...scoreMap,
                            [subField(subjectId)]: totalScore
                        }),
                        {}
                    ),
                    name: marksheetData.studentDetails.fullName,
                    total: marksheetData.marksData.totalMarks,
                    average: marksheetData.marksData.avgMarks,
                    position: marksheetData.marksData.position,
                })))
            });
    },[selectionData,getAllMarksheetData]);

    const handlePrint = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [columns.slice(0,-1).map(col => col.headerName)],
            body: rows.map(row => columns.slice(0,-1).map(col => row[col.field])),
        });
        doc.save('TabulationSheet.pdf');
    };

    return (
        <Box paddingX={5} paddingY={3}>
            {/* Main Heading */}
            <Typography variant="h4" gutterBottom align="left" style={{ fontWeight: 'bold' }}>
                Marksheet Tabulation
            </Typography>

            <Box
                padding={2}
                borderRadius={1}
                boxShadow={2}
                bgcolor="background.paper"
                marginBottom={3}
            >
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    Select class, section and exam:
                </Typography>
                <SelectionForm onSubmit={setSelectionData}/>
            </Box>

            {/* DataGrid Box */}
            {selectionData && (
                <Box
                    padding={2}
                    borderRadius={1}
                    boxShadow={2}
                    bgcolor="background.paper"
                >
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns} pageSize={5}/>
                    </div>
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#04b63b', color: '#000', fontSize: '14px', fontWeight: 'bold' }}
                            onClick={handlePrint}
                            startIcon={<PrintIcon />}
                        >
                            Print Tabulation Sheet
                        </Button>
                    </Box>
                    <MarksheetPopup marksheetData={popupData} closePopup={()=>setPopupData(null)} />
                </Box>
            )}
        </Box>
    );
};

export default TabulationSheet;
