import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
const ClassContext = createContext();
const SubjectContext = createContext();
const SectionContext = createContext();
const ExamContext = createContext();
export {
    UserContext,
    ClassContext,
    SubjectContext,
    SectionContext,
    ExamContext,
};

export const UserProvider = (props) => {
    const [users, setUsers] = useState(null);
    const [classes, setClasses] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [sections, setSections] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [exams, setExams] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [timetables, setTimetables] = useState(null);
    const [timeslots, setTimeslots] = useState(null);
    const [manageTimeslots, setManageTimeslots] = useState(null);
    const [grades, setGrades] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);

    // fetch and set the users
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/users")
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the classes
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/classes")
            .then((res) => setClasses(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the subjects
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/subjects")
            .then((res) => setSubjects(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the sections
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/sections")
            .then((res) => setSections(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the exams
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/exams")
            .then((res) => setExams(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the timetables
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/timetables")
            .then((res) => setTimetables(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the timeslots
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/timeslots")
            .then((res) => {
                let slots = res.data;
                slots.sort((a,b)=>{
                    if(a.startTime===b.startTime){
                        return a.endTime<b.endTime;
                    }else{
                        return a.startTime<b.startTime;
                    }
                })
                setTimeslots(slots);
            })
            .catch((err) => console.log(err));
    }, []);
    // fetch and set the manageTimeslots
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/manageTimeslots")
            .then((res) => setManageTimeslots(res.data))
            .catch((err) => console.log(err));
    }, []);
    // fetch and set grades
    useEffect(() => {
        axios
            .get("http://localhost:1234/api/grades")
            .then((res) => setGrades(res.data))
            .catch((err) => console.log(err));
    }, []);

    // Function to add a new user
    const addUser = (newUser) => {
        setUsers([...users, newUser]);
    };
    // Function to update an existing user
    const updateUser = (updatedUser) => {
        setUsers(
            users.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };
    // Function to delete a user by ID
    const deleteUser = (userId) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    // Function to add a new class
    const addClass = (newClass) => {
        setClasses([...classes, newClass]);
    };
    // Function to update an existing class
    const updateClass = (updatedClass) => {
        setClasses(
            classes.map((classObj) =>
                classObj.id === updatedClass.id ? updatedClass : classObj
            )
        );
    };
    // Function to delete a class by ID
    const deleteClass = (classId) => {
        setClasses(classes.filter((classObj) => classObj.id !== classId));
    };

    // Function to add a new subject
    const addSubject = (newSubject) => {
        setSubjects([...subjects, newSubject]);
    };
    // Function to update an existing subject
    const updateSubject = (updatedSubject) => {
        setSubjects(
            subjects.map((subject) =>
                subject.id === updatedSubject.id ? updatedSubject : subject
            )
        );
    };
    // Function to delete a subject by ID
    const deleteSubject = (subjectId) => {
        setSubjects(subjects.filter((subject) => subject.id !== subjectId));
    };

    // Function to add a new section
    const addSection = (newSection) => {
        setSections([...sections, newSection]);
    };
    // Function to update an existing section
    const updateSection = (updatedSection) => {
        setSections(
            sections.map((section) =>
                section.id === updatedSection.id ? updatedSection : section
            )
        );
    };
    // Function to delete a section by ID
    const deleteSection = (sectionId) => {
        setSections(sections.filter((section) => section.id !== sectionId));
    };

    // Function to add a new exam
    const addExam = (newExam) => {
        setExams([...exams, newExam]);
    };
    // Function to update an existing exam
    const updateExam = (updatedExam) => {
        setExams(
            exams.map((exam) =>
                exam.id === updatedExam.id ? updatedExam : exam
            )
        );
    };
    // Function to delete an exam by ID
    const deleteExam = (examId) => {
        setExams(exams.filter((exam) => exam.id !== examId));
    };
    const addTimetable = (newTimetable) => {
        setTimetables([...timetables, newTimetable]);
    };
    const addTimeslot = (newTimeslot) => {
        setTimeslots([...timeslots, newTimeslot]);
    };
    const addManageTimeslot = (newManageTimeslot) => {
        setManageTimeslots([...manageTimeslots, newManageTimeslot]);
    };

    // Function to add Grade
    const addGrade = (newGrade) => {
        setGrades([...grades, newGrade]);
    };
    // Function to update an existing grade
    const updateGrade = (updatedGrade) => {
        setGrades(
            grades.map((grade) =>
                grade.id === updatedGrade.id ? updatedGrade : grade
            )
        );
    };
    // Function to delete a grade by ID
    const deleteGrade = (gradeID) => {
        setGrades(grades.filter((grade) => grade.id !== gradeID));
    };

    return (
        <UserContext.Provider
            value={{
                users,
                addUser,
                updateUser,
                deleteUser,
                classes,
                addClass,
                updateClass,
                deleteClass,
                selectedClass,
                setSelectedClass,
                subjects,
                addSubject,
                updateSubject,
                deleteSubject,
                selectedSubject,
                setSelectedSubject,
                sections,
                addSection,
                updateSection,
                deleteSection,
                selectedSection,
                setSelectedSection,
                exams,
                addExam,
                updateExam,
                deleteExam,
                selectedExam,
                setSelectedExam,
                selectedUser,
                setSelectedUser,
                timetables,
                addTimetable,
                timeslots,
                addTimeslot,
                manageTimeslots,
                addManageTimeslot,
                grades,
                addGrade,
                updateGrade,
                deleteGrade,
                selectedGrade,
                setSelectedGrade
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};