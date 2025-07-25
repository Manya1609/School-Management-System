import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const DBContext = createContext();
export default DBContext;

const baseURL = `http://localhost:${process.env.REACT_APP_DBPORT}`;

function useDBCache(token) {
  const [dbClient, setDbClient] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [cache, setCache] = useState({});
  const [apiCalls, setApiCalls] = useState({
    head: null,
    get: null,
    put: null,
    post: null,
    delete: null,
  });

  useEffect(() => {
    if (!token) return;
    const instance = axios.create({
      baseURL,
      headers: { Authorization: "Bearer " + token },
    });
    setDbClient({ ...instance });
  }, [token]);

  useEffect(() => {
    if (!dbClient) return;
    function HEAD(subUrl, { params = {} } = {}) {
      return dbClient.head(subUrl, { params });
    }
    function GET(subUrl, { params = {} } = {}) {
      const cacheKey = JSON.stringify({ subUrl, params });
      const cached = cache[cacheKey];
      if (cached && cached.lastUpdated === lastUpdated) {
        return new Promise((resolve, reject) => resolve({ data: cached.data }));
      } else {
        return dbClient.get(subUrl, { params }).then((res) => {
          // console.log({ ...cache, [cacheKey]: {data: res.data, lastUpdated} });
          setCache({ ...cache, [cacheKey]: { data: res.data, lastUpdated } });
          return res;
        });
      }
    }
    function PUT(subUrl, { params = {}, data = {} } = {}) {
      return dbClient.put(subUrl, data, { params }).then((res) => {
        setLastUpdated(Date.now());
        return res;
      });
    }
    function POST(subUrl, { params = {}, data = {} } = {}) {
      return dbClient.post(subUrl, data, { params }).then((res) => {
        setLastUpdated(Date.now());
        return res;
      });
    }
    function DELETE(subUrl, { params = {}, data = {} } = {}) {
      return dbClient.delete(subUrl, { params, data }).then((res) => {
        setLastUpdated(Date.now());
        return res;
      });
    }
    setApiCalls({ head: HEAD, get: GET, put: PUT, post: POST, delete: DELETE });
  }, [dbClient, cache, lastUpdated]);

  return [apiCalls, lastUpdated];
}

class GenericAPI {
  constructor(
    name,
    dbCache,
    {
      defaultGet = true,
      defaultPut = true,
      defaultPost = true,
      defaultDelete = true,
    } = {}
  ) {
    this.subUrl = `/api/${name}`;
    this.dbCache = dbCache;

    if (defaultGet) this.registerGetMethod();
    if (defaultPut) this.registerPutMethod();
    if (defaultPost) this.registerPostMethod();
    if (defaultDelete) this.registerDeleteMethod();
  }
  registerGetMethod({
    subUrlConstructor = ({ id = null }) => this.subUrl + (id ? `/${id}` : ""),
    methodName = "get",
  } = {}) {
    this[methodName] = ({ params = {}, ...urlArgs } = {}) => {
      const subUrl = subUrlConstructor(urlArgs);
      if (!subUrl)
        return Promise.reject({
          message: "Could not construct sub-URL from given args!",
        });
      else return this.dbCache.get(subUrl, { params }).then(({ data }) => data);
    };
  }
  registerPutMethod({
    subUrlConstructor = ({ id }) => this.subUrl + `/${id}`,
    methodName = "put",
  } = {}) {
    this[methodName] = ({ putData, params = {}, ...urlArgs } = {}) => {
      console.log(putData)
      const subUrl = subUrlConstructor(urlArgs);
      if (!subUrl)
        return Promise.reject({
          message: "Could not construct sub-URL from given args!",
        });
      else
        return this.dbCache
          .put(subUrl, { data: putData, params })
          .then(({ data }) => data);
    };
  }
  registerPostMethod({
    subUrlConstructor = () => this.subUrl,
    methodName = "post",
  } = {}) {
    this[methodName] = ({ postData, params = {}, ...urlArgs } = {}) => {
      const subUrl = subUrlConstructor(urlArgs);
      if (!subUrl)
        return Promise.reject({
          message: "Could not construct sub-URL from given args!",
        });
      else
        return this.dbCache
          .post(subUrl, { data: postData, params })
          .then(({ data }) => data);
    };
  }
  registerDeleteMethod({
    subUrlConstructor = ({ id }) => this.subUrl + `/${id}`,
    methodName = "delete",
  } = {}) {
    this[methodName] = ({ params = {}, deleteData = {}, ...urlArgs } = {}) => {
      const subUrl = subUrlConstructor(urlArgs);
      if (!subUrl)
        return Promise.reject({
          message: "Could not construct sub-URL from given args!",
        });
      else
        return this.dbCache
          .delete(subUrl, { data: deleteData, params })
          .then(({ data }) => data);
    };
  }
  static getBasicAPIs(dbCache) {
    if (dbCache.head == null) return null;
    else
      return {
        usersAPI: new UsersAPI(dbCache),
        classesAPI: new ClassesAPI(dbCache),
        systemAPI: new SystemAPI(dbCache),
        subjectsAPI: new SubjectsAPI(dbCache),
        examsAPI: new ExamsAPI(dbCache),
        timetablesAPI: new TimetablesAPI(dbCache),
        noticesAPI: new NoticesAPI(dbCache),
        gradesAPI: new GradesAPI(dbCache),
        sectionsAPI: new SectionsAPI(dbCache),
        studentsAPI: new StudentsAPI(dbCache)
      };
  }
}

class UsersAPI extends GenericAPI {
  constructor(dbCache) {
    super("users", dbCache);
    this.students = new StudentsAPI(dbCache);

    this.registerGetMethod({
      subUrlConstructor: ({ role }) => this.subUrl + `/role/${role}`,
      methodName: "getByRole",
    });

    this.registerGetMethod({
      subUrlConstructor: ({ userId }) => this.subUrl + `/${userId}`,
      methodName: "getUserById",
    });

    this.registerGetMethod({
      subUrlConstructor: ({ teacherId }) => this.subUrl + `/by-teacher/${teacherId}`,
      methodName: "getUserByTeacherId",
    });

    this.registerPutMethod({
      subUrlConstructor: ({ userId }) => this.subUrl + `/${userId}`,
      methodName: "updateUserById",
    });
  }
}

class ClassesAPI extends GenericAPI {
  constructor(dbCache) {
    super("classes", dbCache);
    this.sections = new SectionsAPI(dbCache);

    this.registerGetMethod({
      subUrlConstructor: ({ id }) => this.subUrl + `/${id}/students`,
      methodName: "getStudents",
    });
    this.registerGetMethod({
      subUrlConstructor: ({ id }) => this.subUrl + `/${id}/sections`,
      methodName: "getSections",
    });
    this.registerGetMethod({
      subUrlConstructor: ({ id, sectionId }) =>
        this.subUrl + `/${id}/sections/${sectionId}/students`,
      methodName: "getStudentsOfSection",
    });

    this.registerGetMethod({
      subUrlConstructor: ({ id }) => this.subUrl + `/${id}`,
      methodName: "getClassById",
    });

    this.registerGetMethod({
      subUrlConstructor: ({ classId, sectionId }) => this.subUrl + `/${classId}/sections/${sectionId}/students`,
      methodName: "getClassSectionStudents",
    });
  }
}

class SectionsAPI extends GenericAPI {
  constructor(dbCache) {
    super("sections", dbCache);

    this.registerGetMethod({
      subUrlConstructor: ({ userId }) => this.subUrl + `/users/${userId}`,
      methodName: "getSectionAssignedTo",
    });

    this.registerGetMethod({
      subUrlConstructor: ({ classId }) => this.subUrl + `/${classId}`,
      methodName: "getSectionsByClass",
    });
  }
  getSectionById({id}){
    return this
      .get()
      .then(sections=>sections.find(({id:secid})=>`${id}`===`${secid}`));
  }
}

class StudentsAPI extends GenericAPI {
  constructor(dbCache) {
    super("students", dbCache);

    // this.registerPutMethod({
    //   subUrlConstructor: () => this.subUrl + `/promote`,
    //   methodName: "promoteStudents",
    // });
  }

  promote({
    fromClassId,
    fromSectionId,
    toClassId,
    toSectionId,
    studentIdList = [],
    promoted = [],
    params = {},
  } = {}) {
    return this.dbCache
      .put(this.subUrl + "/promote", {
        data: { fromClassId, fromSectionId, toClassId, toSectionId, studentIdList, promoted },
        params,
      })
      .then(({ data }) => data);
  }
}

class SystemAPI extends GenericAPI {
  constructor(dbCache) {
    super("system", dbCache, { defaultDelete: false });

    this.registerGetMethod({
      subUrlConstructor: () => this.subUrl + "/stats",
      methodName: "getStats",
    });
    this.registerPostMethod({
      subUrlConstructor: () => "/api/password/reset",
      methodName: "resetPassword",
    });
  }
}

class SubjectsAPI extends GenericAPI {
  constructor(dbCache) {
    super("subjects", dbCache);

    this.registerGetMethod({
      subUrlConstructor: ({ id }) => this.subUrl + `/classes/${id}`,
      methodName: "getByClass",
    });
    this.registerGetMethod({
      subUrlConstructor: ({ userId }) => this.subUrl + `/users/${userId}`,
      methodName: "getSubjectsAssignedTo",
    });
  }
  async assignTeacher({
    subjects = [],
    teacher = { userId: null, fullName: null, email: null },
    params = {},
  } = {}) {
    const userId = teacher.userId,
      teacherName = teacher.fullName,
      teacherEmail = teacher.email;
    if ([userId, teacherName, teacherEmail].some((val) => val == null)) {
      return Promise.reject({ message: "Teacher details were not sent!" });
    }
    const oldSubjectSet = (await this.getSubjectsAssignedTo({ userId })).reduce(
      (set,sub)=>({[sub.subjectId]: sub,...set}),
      {}
    );
    //assign to new
    await Promise.all(
      subjects.map((subject) => {
        const id = subject.subjectId;
        // console.log("assign", id, subject);
        if (oldSubjectSet[id] == null) {
          return this.put({
            id,
            putData: {
              ...subject,
              ...(subject.hasOwnProperty("userId") ? { userId } : {}),
              teacherName,
              teacherEmail,
            },
            params,
          });
        } else {
          //already assigned
          delete oldSubjectSet[id];
          return Promise.resolve(subject);
        }
      })
    );
    //de-assign from old
    await Promise.all(
      Object.entries(oldSubjectSet).map(([id, subject]) => {
        // console.log("deassign", id, subject);
        return this.put({
          id,
          putData: {
            ...subject,
            ...(subject.hasOwnProperty("userId") ? { userId: null } : {}),
            teacherName: null,
            teacherEmail: null,
          },
          params,
        });
      })
    );
  }
}

class ExamsAPI extends GenericAPI {
  constructor(dbCache) {
    super("exams", dbCache);
    this.grades = new GradesAPI(dbCache);
    this.marks = new MarksAPI(dbCache);
  }
  getExamById({id}){
    return this
      .get()
      .then(exams=>exams.find(({id:eid})=>`${id}`===`${eid}`));
  }
}

class GradesAPI extends GenericAPI {
  constructor(dbCache) {
    super("grades", dbCache);
  }
}

class MarksAPI extends GenericAPI {
  constructor(dbCache) {
    super("marks", dbCache, {
      defaultGet: false,
      defaultPut: false,
      defaultPost: false,
      defaultDelete: false,
    });

    this.registerGetMethod({
      subUrlConstructor: ({ classId, sectionId, subjectId, examId }) =>
        this.subUrl +
        `/classes/${classId}/sections/${sectionId}/subjects/${subjectId}/exams/${examId}/marks`,
      methodName: "getMarksFor",
    });
    this.registerPutMethod({
      subUrlConstructor: ({ classId, sectionId, subjectId, examId }) =>
        this.subUrl +
        `/classes/${classId}/sections/${sectionId}/subjects/${subjectId}/exams/${examId}/marks`,
      methodName: "putMarksFor",
    });
    this.registerPostMethod({
      subUrlConstructor: ({ classId, sectionId, subjectId, examId }) =>
        this.subUrl +
        `/classes/${classId}/sections/${sectionId}/subjects/${subjectId}/exams/${examId}/marks`,
      methodName: "postMarksFor",
    });
    this.registerGetMethod({
      subUrlConstructor: () => this.subUrl + "/total",
      methodName: "getTabulation",
    });
  }
}

class TimetablesAPI extends GenericAPI {
  constructor(dbCache) {
    super("timetables", dbCache, {defaultGet: false});
    this.slots = new TimeslotsAPI(dbCache);
    this.manage = new ManageTimetableAPI(dbCache);
  }
  get({id=null}={}){
    const capitalize = (s) => (s[0].toUpperCase()+s.slice(1));
    const allTimetablesPromise = this.dbCache
      .get(this.subUrl)
      .then(({data})=>data.map(({timeTableType,...tt})=>({
        timeTableType: capitalize(timeTableType),
        ...tt
      })));
    if(id==null){
      return allTimetablesPromise;
    }else{
      return allTimetablesPromise
        .then((timetables)=>{
          const tt = timetables?.find(({id: ttid})=>`${id}`===`${ttid}`);
          return tt ?? Promise.reject({
            message: `Timetable with id ${id} not found`
          })
        });
    }
  }
  getSlotsFor({id} = {}){
    return this
      .get({id})
      .then((tt)=>Promise.all([
        tt, 
        this.manage
          .getRecordsFor({ttid:id})
          .then(
            (manageRecords)=>this.slots.getManagedSlots({ manageRecords })
          )
      ]))

  }
  assignSlotsFor({id, newManagedSlots=[]} = {}){
    // debugger;
    newManagedSlots.sort(managedSlotComparator);
    return this
      .getSlotsFor({id})
      .then(([tt,oldManagedSlots])=>{
        // console.log("new",newManagedSlots);
        // console.log("old",oldManagedSlots);
        let promisesArray = [];
        let newI = 0, oldI = 0;
        while(newI < newManagedSlots.length){
          const {id:newId,timeSlotId,timeTableId,dayOfWeek: DoW,date,subjectId} = newManagedSlots[newI];
          const dayOfWeek = DoW ? Number(DoW)+1 : 0;
          if(newId!=null) break;
          promisesArray.push(this.manage.post(
            {postData: {timeSlotId,timeTableId,dayOfWeek,date,subjectId}}
          ));
          newI++;
        }
        while(oldI < oldManagedSlots.length){
          const newSlot = newManagedSlots[newI] ?? null, oldSlot = oldManagedSlots[oldI];
          if(newSlot?.id===oldSlot.id){
            newI++;
            oldI++;
          }else{
            // console.log("Del",oldSlot);
            promisesArray.push(this.manage.delete({id:oldSlot.id}));
            oldI++;
          }
        }
        return Promise.all(promisesArray)
          .then(()=>Promise.resolve(`Assigned slots for timetable ${id}`));
      })
  }
}

function managedSlotComparator(slot1,slot2){
  if(slot1.id==null) return -1;
  if(slot2.id==null) return 1;
  let compField = "startTime";
  if(slot1.startTime===slot2.startTime){
    if(slot1.dayOfWeek!=null && slot2.dayOfWeek!=null){
      compField = "dayOfWeek";
    }else if(slot1.date!=null && slot2.date!=null){
      compField = "date";
    }else{
      return 0;
    }
  }
  const c1 = slot1[compField], c2 = slot2[compField];
  if(c1===c2) return 0;
  else if(c1<c2) return -1;
  else return 1;
}

class TimeslotsAPI extends GenericAPI {
  constructor(dbCache) {
    super("timeslots", dbCache);
  }
  getManagedSlots({manageRecords = []} = {}){
    if(!manageRecords) return [];
    return this
      .get()
      .then((slots)=>{
          if(!slots) return [];
          let managedSlots = manageRecords.reduce((arr,{dayOfWeek: DoW, ...rec})=>{
            const slot = slots.find(({id})=>id===rec.timeSlotId);
            const dayOfWeek = rec.date==null ? DoW - 1 : null;
            if(!slot) return arr;
            else return [
              ...arr,
              {
                ...slot,
                ...rec,
                dayOfWeek, 
                shortName: null
              }
            ];
          },[]);
          managedSlots.sort(managedSlotComparator);
          return managedSlots;
      })
  }
}

class ManageTimetableAPI extends GenericAPI {
  constructor(dbCache) {
    super("managetimetable", dbCache);
  }
  getRecordsFor({ttid} = {}){
    return this
      .get()
      .then((manageRecords)=>{
        return manageRecords?.filter(
          ({timeTableId})=>`${timeTableId}`===`${ttid}`
        )
      })
  }
}

class NoticesAPI extends GenericAPI {
  constructor(dbCache) {
    super("notices", dbCache);
  }
}

function getCompoundAPIs(basicAPIs){
  if (basicAPIs == null) return null;
  const {
    usersAPI,
    classesAPI,
    systemAPI,
    subjectsAPI,
    examsAPI,
    timetablesAPI,
    noticesAPI,
    gradesAPI,
    sectionsAPI,
  } = basicAPIs;

  function getManagedUsers() {
    return usersAPI.get().then(async (data) => {
      let usersList = [];
      for (let rawUserData of data) {
        const {dob, ...userData} = rawUserData;
        const dateOfBirth = `${dob}`.split('T')[0];
        const { role, userId } = userData;
        let additionalInfo = {};
        if (role === "student") {
          const assignedClsSec = await classesAPI.sections
            .getSectionAssignedTo({ userId })
            .catch((err) => (null));
          additionalInfo = { cls: null, sec: null};
          if(assignedClsSec){
            const {classId, sectionId, className, sectionName} = assignedClsSec;
            additionalInfo.cls = {id: classId, name: className};
            additionalInfo.sec = {id: sectionId, name: sectionName};
          }
        } else if (role === "teacher") {
          const subjects = await subjectsAPI
            .getSubjectsAssignedTo({ userId })
            .catch((err) => []);
          additionalInfo = { subjects };
        }
        usersList.push({ ...userData, dateOfBirth, additionalInfo });
      }
      return usersList;
    });
  }

  function addManagedUser(addUserFormData) {
    const { additionalInfo = {}, dateOfBirth: dob, ...rawUserData } = addUserFormData;
    const userData = {...rawUserData, dob};
    return usersAPI.post({ postData: userData }).then(async (data) => {
      // console.log("Added user: ", data);
      const { role } = userData;
      const { userId } = data;
      if (role === "student") {
        const {cls,sec} = additionalInfo;
        const {classId = null, sectionId = null} = (cls && sec) ? {classId: cls.id, sectionId: sec.id} : {};
        const stuResponse = await usersAPI.students.post({
          postData: { userId, classId, sectionId },
        });
        console.log("Added student: ", stuResponse);
      } else if (role === "teacher") {
        const { subjects } = additionalInfo;
        const { fullName, email } = userData;
        await subjectsAPI.assignTeacher({
          subjects,
          teacher: { userId, fullName, email },
        });
      }
      return data;
    });
  }

  function modifyManagedUser(modifyUserFormData) {
    const { additionalInfo = {}, dateOfBirth: dob, ...rawUserData } = modifyUserFormData;
    const userData = {...rawUserData, dob};
    const { userId } = userData;
    const id = userId;
    return usersAPI
      .put({ id, putData: { ...userData } })
      .then(async (data) => {
        // console.log("Modified user: ", data);
        const { role } = userData;
        if (role === "student") {
          const {cls,sec} = additionalInfo;
          await usersAPI.students.put({
            id,
            putData: { userId, classId: cls.id, sectionId: sec.id },
          });
          // console.log("Modified student with id ", userId);
        } else if (role === "teacher") {
          const { subjects } = additionalInfo;
          const { fullName, email } = userData;
          await subjectsAPI.assignTeacher({
            subjects,
            teacher: { userId, fullName, email },
          });
        }
        return data;
      });
  }

  function removeManagedUser(userData) {
    const { userId, fullName, email, role } = userData;
    let prepDelete = Promise.resolve();
    if (role === "student") {
      prepDelete = usersAPI.students.delete({ id: userId });
    } else if (role === "teacher") {
      prepDelete = subjectsAPI.assignTeacher({
        subjects: [],
        teacher: { userId, fullName, email },
      });
    }
    return prepDelete.then(() => usersAPI.delete({ id: userId }));
  }

  function getStudentsWithUserDataFor({classId, sectionId = null}){
    return (
      sectionId == null ?
        classesAPI.getStudents({id: classId}) :
        classesAPI.getStudentsOfSection({id: classId, sectionId})
    ).then((students)=>Promise.all(students.map((student)=>{
      return usersAPI
        .get({id: student.userId})
        .then(user=>({...user,...student}));
    })))
  }

  function getManagedMarks(marksSelectionData){
    const {classId,sectionId,examId} = marksSelectionData;

    return Promise.all([
      getStudentsWithUserDataFor({classId,sectionId})
        .then(studentUsers=>studentUsers.map(
          ({userId,admissionNumber: admNo,fullName})=>({
            userId,
            admissionNumber: admNo || null,
            fullName
          }))
        ),
      examsAPI.marks
        .getMarksFor(marksSelectionData)
        .then((marks)=>marks.reduce((marksMap,mark)=>({
          ...marksMap,
          [mark.studentId]: mark
        }),{}))
    ]).then(([studentUsers,marksMap])=>{
      return studentUsers.map((studentUser)=>{
        const marks = marksMap[studentUser.userId] ?? {
          studentId: studentUser.userId,
          gradeId: 0,
          examId,
          score1: 0,
          score2: 0,
          score3: 0
        }
        return {...studentUser,...marks};
      })
    })
  }

  function postManagedMarks(marksSelectionData,managedMarks){
    return examsAPI.marks
      .postMarksFor({
        ...marksSelectionData,
        postData: managedMarks.map((markDataRaw)=>{
          const {studentId,examId,score1,score2,score3} = markDataRaw;
          return {studentId,examId,score1,score2,score3};
        })
      });
  }

  function getPositions(arr,key=(x)=>x){
    const comparator = ([a,i],[b,j]) => {
      const k1 = key(a), k2 = key(b);
      if(k1===k2) return 0;
      else if(k1<k2) return 1;
      else if(k1>k2) return -1;
    }
    let idxTracker = arr.map((x,i)=>([x,i]));
    idxTracker.sort(comparator);
    let positions = Array(arr.length).fill(1);
    idxTracker.forEach(([val,i],pos) => {
      let position = pos+1;
      while(position>1 && key(val)===key(idxTracker[position-2][0])){
        position--;
      }
      positions[i] = position;
    });
    return positions;
  }

  function getMarksheetData(studentUser,classSec,exam,subjectWise){
    const {
      userId,
      fullName,
      admissionNumber,
      classId,
      sectionId,
      sportsHouse
    } = studentUser;
    const {className,sectionName} = classSec;
    const {
      id: examId,
      name: examName,
      term: examTerm
    } = exam;

    const schoolDetailsPromise = systemAPI
      .get()
      .then(({nameOfSchool,schoolAcronym,schoolAddress})=>(
        {nameOfSchool,schoolAcronym,schoolAddress}
      ));
    const studentDetails = {
      userId,
      fullName,
      admissionNumber,
      classId,
      className,
      sectionId,
      sectionName,
      sportsHouse
    };
    const totalMarks = subjectWise.reduce((sum,{totalScore})=>(sum+totalScore),0);
    const marksData = {
      examId,
      examName,
      examTerm,
      totalMarks,
      subjectWise,
      avgMarks: totalMarks/subjectWise.length
    };

    return schoolDetailsPromise
      .then(schoolDetails=>({
        schoolDetails,
        studentDetails,
        marksData
      }));
  }

  function getAllMarksheetData(classId,sectionId,examId){
    const getNestedMarks = ([subjects,grades]) => {
      return Promise.all(subjects.map(
        ({subjectId,subjectName,shortName})=>getManagedMarks(
          {classId,sectionId,examId,subjectId}
        ).then(managedMarks=>Promise.all(managedMarks.map(
          ({studentId,gradeId,score1,score2,score3})=>{
            const {gradeName = "N/A", gradeRemark = "Not Graded"} = grades.find(
              ({gradeId: gid})=>`${gradeId}`===`${gid}`
            ) ?? {};
            return {
              studentId,
              subjectId,
              subjectName,
              shortName,
              score1,
              score2,
              score3,
              contScore: score1+score2,
              totalScore: score1+score2+score3,
              gradeId,
              gradeName,
              gradeRemark
            };
        })))
      ))
    }
    const allMarksPromise = Promise.all([
      subjectsAPI.getByClass({id: classId}),
      gradesAPI.get()
    ]).then(getNestedMarks)
    .then((nested)=>{
      let marksMap = {};
      for(let inner of nested){
        for(let mark of inner){
          const {studentId: k, ...markData} = mark;
          if(marksMap[k]){
            marksMap[k].push(markData);
          }else{
            marksMap[k] = [markData];
          }
        }
      }
      return marksMap;
    });
    const classSecPromise = Promise.all([
      classesAPI.getClassById({id: classId}),
      sectionsAPI.getSectionById({id: sectionId}),
    ]).then(([cls,sec])=>({
      className: cls.name,
      sectionName: sec.name
    }));
    return Promise.all([
      getStudentsWithUserDataFor({classId,sectionId}),
      classSecPromise,
      examsAPI.getExamById({id: examId}),
      allMarksPromise
    ]).then(([studentUsers,classSec,exam,allMarksMap])=>Promise.all(
      studentUsers.map((studentUser)=>{
        return getMarksheetData(
          studentUser,
          classSec,
          exam,
          allMarksMap[studentUser.userId]
        );
      })
    )).then((marksheetDataList)=>{
      if(!marksheetDataList.length) return [];
      const dummySubjectWise = marksheetDataList[0].marksData.subjectWise;
      const overallPositions = getPositions(marksheetDataList,(x)=>x.marksData.totalMarks);
      const subjectWisePositions = dummySubjectWise.map((_,i)=>getPositions(
        marksheetDataList,
        (x)=>x.marksData.subjectWise[i].totalScore
      ));
      const classAvgMarks = marksheetDataList.reduce((sum,marksheetData)=>{
        return sum + marksheetData.marksData.avgMarks;
      },0)/marksheetDataList.length;
      return marksheetDataList.map((marksheetData,i)=>({
        ...marksheetData,
        marksData: {
          ...marksheetData.marksData,
          subjectWise: marksheetData.marksData.subjectWise.map((subjMarks,j)=>({
            ...subjMarks,
            position: subjectWisePositions[j][i]
          })),
          position: overallPositions[i],
          classAvgMarks
        }
      }));
    });
  }

  function getTimetableSlotsForUser({userId} = {}){
    const ttListPromise = timetablesAPI.get();
    const classIdPromise = classesAPI.sections
      .getSectionAssignedTo({userId})
      .then(({classId})=>(
        classId ?? Promise.reject("Class not found")
      ));
    return Promise.all([ttListPromise,classIdPromise])
      .then(([ttList,classId])=>{
        const userTTs = ttList?.filter((tt)=>tt.classId===classId) ?? [];
        console.log(ttList,classId);
        return Promise.all(userTTs.map(
            ({id})=>timetablesAPI.getSlotsFor({id})
          )).then((slotsList)=>[
            {id: null, name: "Consolidated", classId, type: "Consolidated"},
            slotsList.reduce((arr,[_,slots])=>[...arr,...slots],[])
          ]);
      });
  }

  return {
    getManagedUsers,
    addManagedUser,
    modifyManagedUser,
    removeManagedUser,
    getStudentsWithUserDataFor,
    getManagedMarks,
    postManagedMarks,
    getAllMarksheetData,
    getTimetableSlotsForUser,
  };
}

export function DBProvider(props) {
  const { token } = useAuth();
  const [dbCache, cacheLastUpdated] = useDBCache(token);
  const [updateAPIs, setUpdateAPIs] = useState(true);
  const [dbAPIs, setDbAPIs] = useState({});

  useEffect(()=>{
    setUpdateAPIs(true);
  },[cacheLastUpdated]);

  useEffect(() => {
    if (dbCache.head == null || updateAPIs){
      const basicAPIs = GenericAPI.getBasicAPIs(dbCache);
      const compoundAPIs = getCompoundAPIs(basicAPIs);
      if (compoundAPIs == null) return;
      setDbAPIs({ ...basicAPIs, ...compoundAPIs });
      setUpdateAPIs(false);
    }
  }, [dbCache, updateAPIs]);

  return (
    <DBContext.Provider value={dbAPIs}>
      {(token != null && dbAPIs.usersAPI == null) ? <div>Loading...</div> : props.children}
    </DBContext.Provider>
  );
}
