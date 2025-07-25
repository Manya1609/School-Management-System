package com.adobe.prj.backend.mapper;


import com.adobe.prj.backend.dto.marks.MarksDTO;
import com.adobe.prj.backend.entity.*;
import com.adobe.prj.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class MarksMapper {
    @Autowired
    ExamRepository examRepository;

    @Autowired
    StudentRepository studentRepository;

//    @Autowired
//    ExamListRepository examListRepository;

    @Autowired
    MarksRepository marksRepository;

    @Autowired
    GradeRepository gradeRepository;
    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    public Void toEntityList(List<MarksDTO> marksDTOList, int examId, int classId, int sectionId, int subjectId) {
        marksDTOList.stream().map(i -> toEntity(i, examId, classId, sectionId, subjectId)).collect(Collectors.toList());
    return null;
    }

    private Void toEntity(MarksDTO marksDTO, int examId, int classId, int sectionId, int subjectId) {
        Exam exam = examRepository.findById(examId).get();
        StudentEnrollment studentEnrollment = studentEnrollmentRepository.findByData(marksDTO.getStudentId(), sectionId, subjectId);
//        System.out.println("___________________________________"+studentEnrollment.getId()+"____________________________________________");
        Marks marks = marksRepository.findByExamAndStudentEnrollment(examId,studentEnrollment.getId()).orElseGet(() -> new Marks());
        marks.setExam(exam);
        marks.setStudentEnrollment(studentEnrollment);
        marks.setScore1(marksDTO.getScore1());
        marks.setScore2(marksDTO.getScore2());
        marks.setScore3(marksDTO.getScore3());
        marks.setGrade(gradeRepository.findGradeByMarks(1)); // To set least case as default.
        marks.setGrade(gradeRepository.findGradeByMarks(marksDTO.getScore1() + marksDTO.getScore2() + marksDTO.getScore3()));
        marksRepository.save(marks);
        return null;
    }

    public MarksDTO toDTO(Marks marks) {
        MarksDTO marksDTO = new MarksDTO();
        marksDTO.setScore1(marks.getScore1());
        marksDTO.setScore2(marks.getScore2());
        marksDTO.setScore3(marks.getScore3());
        marksDTO.setGradeId(marks.getGrade().getGrade_id());
        marksDTO.setExamId(marks.getExam().getExam_id());
        marksDTO.setStudentId(marks.getStudentEnrollment().getStudent().getUser().getUserId());
        return marksDTO;
    }


//    public AddMarksListRequest toDTO(List<Integer> studentIdList, ExamList examList) {
//        AddMarksListRequest addMarksListRequest = new AddMarksListRequest();
//        addMarksListRequest.setStudentIdList(studentIdList);
//
//        List<Marks> marks = IntStream.range(0,studentIdList.size()).
//                mapToObj(i->marksRepository.findAllByData(studentIdList.get(i),examList.getEeid())).collect(Collectors.toList());
//        List<Integer> score1List = marks.stream().map(i->i.getScore1()).collect(Collectors.toList());
//        List<Integer> score2List = marks.stream().map(i->i.getScore2()).collect(Collectors.toList());
//        List<Integer> score3List = marks.stream().map(i->i.getScore3()).collect(Collectors.toList());
//        addMarksListRequest.setScore1List(score1List);
//        addMarksListRequest.setScore2List(score2List);
//        addMarksListRequest.setScore3List(score3List);
//        return addMarksListRequest;
//    }
//
//    public List<MarksDTO> toMarksDTO(List<Subject> subjects, int examId, int studentId) {
//        List<MarksDTO> marksDTOList = IntStream.range(0,subjects.size()).mapToObj(i->convertToDTO(subjects.get(i).getId(),examId,studentId)).collect(Collectors.toList());
//        return  marksDTOList;
//    }
//    private MarksDTO convertToDTO(int subjectId, int examId, int studentId) {
//        Marks marks = marksRepository.findAllByData(studentId,examListRepository.findByExamAndSubject(examId,subjectId).getEeid());
//        MarksDTO marksDTO = new MarksDTO();
//        Student student = studentRepository.findById(studentId).get();
//        marksDTO.setClassId(student.getClazz().getId());
//        marksDTO.setSectionId(student.getSection().getId());
//        marksDTO.setExamId(examId);
//        marksDTO.setStudentId(studentId);
//        marksDTO.setSubjectId(subjectId);
//        marksDTO.setScore1(marks.getScore1());
//        marksDTO.setScore2(marks.getScore2());
//        marksDTO.setScore3(marks.getScore3());
//        return marksDTO;

//    }
}
