import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DBContext from "../context/DBContext";

function SectionSelectionForm(props) {
  const { onSubmit } = props;
  const [selectionFormData, setSelectionFormData] = useState({
    classId: "",
    sectionId: "",
    subjectId: "",
    examId: "",
  });
  const { classesAPI, examsAPI, subjectsAPI } = useContext(DBContext);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
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
    const id = selectionFormData.classId;
    if (id === "") return;
    subjectsAPI
      .getByClass({ id })
      .then((subjs) => setSubjects(subjs));
  }, [selectionFormData.classId, subjectsAPI]);
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
      <Box paddingX={"1%"} fontSize={"200%"}>
        Select Section and Exam
      </Box>
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
                <InputLabel>Subject</InputLabel>
                <Select
                  required
                  label={"Subject"}
                  name={"subjectId"}
                  value={selectionFormData.subjectId}
                  onChange={handleChange}
                  disabled={
                    selectionFormData.classId === "" || subjects?.length === 0
                  }
                >
                  {subjects.map((subj) => (
                    <MenuItem key={subj.subjectId} value={subj.subjectId}>
                      {subj.subjectName}
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

export default function ManageMarks(props) {
  const [selectionData,setSelectionData] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [disablePublish, setDisablePublish] = useState(true);
  const [error, setError] = useState("");
  const {getManagedMarks,postManagedMarks} = useContext(DBContext);

  useEffect(()=>{
    if(selectionData==null) return;
    console.log("Selection changed: ", selectionData);
    getManagedMarks(selectionData)
      .then(managedMarks=>{
        setMarksData(managedMarks.map((managed,i)=>({
          ...managed,
          sn: i+1,
          id: i
        })));
      })
  },[getManagedMarks,selectionData]);

  function editableColumn(field, headerName, {width = 200, validate = (()=>true)} = {}) {
    return {
      field,
      headerName,
      width,
      editable: true,
      renderCell: (params) => (
        <Grid container columns={4}>
          <Grid item xs={1} textAlign={"right"}>
            {params.value}
          </Grid>
          <Grid item xs visibility={validate(params.value) ? 'hidden' : 'visible'}>
            <Box sx={{color: "red"}}>!</Box>
          </Grid>
          <Grid item xs={1}>
            <EditIcon />
          </Grid>
        </Grid>
      ),
    };
  }

  function validMarks(maxMarks){
    return (x)=>{
      const marks = Number(x);
      if(Number.isNaN(marks) || marks==null) return true;
      return (0<=marks && marks<=maxMarks);
    }
  }
  const columns = [
    { field: "sn", headerName: "S/N", width: 100 },
    { field: "fullName", headerName: "Student Name", width: 400 },
    { field: "admissionNumber", headerName: "Admission No.", width: 300 },
    editableColumn("score1", "CA 1 (/20)", {validate: validMarks(20)}),
    editableColumn("score2", "CA 2 (/20)", {validate: validMarks(20)}),
    editableColumn("score3", "EXAM (/60)", {validate: validMarks(60)}),
  ];

  function handleRowUpdate(newRow, oldRow) {
    if (Object.keys(newRow).some((k) => newRow[k] !== oldRow[k])) {
      const rowIdx = marksData.findIndex((record) => record.id === newRow.id);
      setMarksData([
        ...marksData.slice(0, rowIdx),
        newRow,
        ...marksData.slice(rowIdx + 1),
      ]);
      setError("");
      setDisablePublish(false);
    }
    return newRow;
  }

  function handlePublish() {
    console.log("Publishing: ", marksData);

    if(marksData.some(({score1,score2,score3})=>(
      Number(score1) < 0 || Number(score1) > 20 ||
      Number(score2) < 0 || Number(score2) > 20 ||
      Number(score3) < 0 || Number(score3) > 60
    ))){
      setError("Invalid marks!");
      setDisablePublish(true);
      return;
    }

    postManagedMarks(selectionData,marksData)
      .then((data)=>{
        console.log("Published successfully: ",data);
        setDisablePublish(true);
      }).catch((err)=>console.log("Error publishing: ",err));
  }

  return (
    <Box>
      <Box>
        <SectionSelectionForm onSubmit={setSelectionData} />
      </Box>
      <Divider variant="middle" />
      <Box margin={"1%"} height={"50vh"} padding={"1%"}>
        <Box fontSize={"200%"}>Manage Student Marks</Box>
        <DataGrid
          rows={marksData}
          columns={columns}
          processRowUpdate={handleRowUpdate}
          onProcessRowUpdateError={(e) => console.error(e)}
          slotProps={{ columnHeaders: { sx: { bgColor: "primary" } } }}
        />
        <Box width={"100%"} display={"flex"} margin={"1%"} paddingX={"5%"} color={"red"} justifyContent={"center"}>
          {error}
        </Box>
        <Box width={"100%"} display={"flex"} margin={"1%"}>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: "auto", width: "40%" }}
            onClick={handlePublish}
            disabled={disablePublish}
          >
            Publish
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
