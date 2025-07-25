package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.marks.MarksDTO;

import com.adobe.prj.backend.dto.marks.TabulationData;
import com.adobe.prj.backend.dto.marks.TabulationPDF;
import com.adobe.prj.backend.entity.Marks;
import com.adobe.prj.backend.entity.Student;
import com.adobe.prj.backend.entity.StudentEnrollment;
import com.adobe.prj.backend.entity.Subject;
import com.adobe.prj.backend.mapper.MarksMapper;

import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MarksService {
    @Autowired
    MarksRepository marksRepository;
    @Autowired
    private MarksMapper marksMapper;
    @Autowired
    StudentMapper studentMapper;
    @Autowired
    ClassService classService;

    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    StudentEnrollmentRepository studentEnrollmentRepository;
    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private StudentRepository studentRepository;

    public void addMarks(List<MarksDTO> marksDTOList, int examId, int classId, int sectionId, int subjectId) {
        marksMapper.toEntityList(marksDTOList,examId,classId,sectionId,subjectId);
    }

    public List<MarksDTO> getMarks(int examId, int sectionId, int classId, int subjectId) {
        List<StudentEnrollment> studentEnrollmentList = studentEnrollmentRepository.findByClassSectionSubject(sectionId,subjectId);
        List<Marks> marksList = studentEnrollmentList
            .stream()
            .map(i->getMarksEach(examId,i.getId()))
            .filter(i->i.isPresent())
            .map(i->i.get())
            .toList();
        List<MarksDTO> marksDTOList = marksList.stream().map(marksMapper::toDTO).collect(Collectors.toList());
        return marksDTOList;

    }

    private Optional<Marks> getMarksEach(int examId,int studentEnrollmentId){
        Optional<Marks> marks = marksRepository.findByExamAndStudentEnrollment(examId,studentEnrollmentId);
        return marks;
    }

    public void update(List<MarksDTO> marksDTOList, int examId, int classId, int sectionId, int subjectId) {
        marksMapper.toEntityList(marksDTOList,examId,classId,sectionId,subjectId);
   }

    public List<TabulationData> getTabulation(int examId, int sectionId, int classId) {
        List<Student> studentList = classService.getStudentsOfClassSection(classId,sectionId).stream().map(studentMapper::toEntity).collect(Collectors.toList());
        List<TabulationData> tabulationDataList = studentList.stream().map(i->createTabulation(examId,i.getUser().getUserId(),sectionId)).collect(Collectors.toList());
        return tabulationDataList;
    }

    public TabulationData createTabulation(int examId, int studentId, int sectionId) {
        List<StudentEnrollment> studentEnrollmentList = studentEnrollmentRepository.findByStudentSection(sectionId,studentId);
        TabulationData tabulationData = new TabulationData();
        tabulationData.setStudentId(studentId);
        List<Integer> subjectIdList = new ArrayList<>();
        List<Integer> totalScoreList = new ArrayList<>();
        for(StudentEnrollment se: studentEnrollmentList){
            subjectIdList.add(se.getSubject().getId());

            Marks marks = marksRepository.findByExamAndStudentEnrollment(examId,se.getId()).get();
            totalScoreList.add(marks.getScore1()+marks.getScore2()+marks.getScore3());
        }
        tabulationData.setSubjectIdList(subjectIdList);
        tabulationData.setTotalScoreList(totalScoreList);
        return tabulationData;
    }


    public List<TabulationPDF> topdfData(List<TabulationData> tabulationDataList) {
        List<TabulationPDF> tabulationPDFList = new ArrayList<>();
        for(int i=1;i<= tabulationDataList.size();i++){
            TabulationPDF tabulationPDF = new TabulationPDF();
            tabulationPDF.setId(i);
            Student student = studentRepository.findById(tabulationDataList.get(i-1).getStudentId()).orElse(null);
            tabulationPDF.setStudentName(student.getUser().getFullName());
            tabulationPDF.setAdmissionNumber(student.getAdmissionNumber());
            tabulationPDF.setFinalScores(tabulationDataList.get(i-1).getTotalScoreList());
            tabulationPDF.setSubjectList(tabulationDataList.get(i-1).getSubjectIdList().stream().map(j->subjectRepository.findById(j).get().getSubjectName()).toList());
            int totalScore = tabulationDataList.get(i-1).getTotalScoreList().stream().mapToInt(Integer::intValue).sum();
            tabulationPDF.setTotalScore(totalScore);
            tabulationPDF.setAverageScore(totalScore/tabulationDataList.size());
            tabulationPDF.setClassName(student.getClazz().getName());
            tabulationPDF.setSectionName(student.getSection().getName());
            tabulationPDFList.add(tabulationPDF);
        }
        return tabulationPDFList;

    }
}
