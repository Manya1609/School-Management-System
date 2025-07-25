package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.dto.student.StudentPromoteRequest;
import com.adobe.prj.backend.entity.Student;
import com.adobe.prj.backend.entity.StudentEnrollment;
import com.adobe.prj.backend.entity.Subject;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SectionRepository;
import com.adobe.prj.backend.repository.StudentEnrollmentRepository;
import com.adobe.prj.backend.repository.StudentRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
public class StudentService {

    @Autowired
    StudentRepository studentRepository;
    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Autowired
    StudentMapper studentMapper;
    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private UserRepository userRepository;

    public StudentDTO create(StudentDTO studentDTO) {
        Student student = studentMapper.toEntity(studentDTO);
        Student savedStudent=studentRepository.save(student);
        refreshStudentEnrollments(savedStudent, false);
        return studentMapper.toDTO(savedStudent);
    }

    public StudentDTO getStudents(int userId) {
        Optional<Student> student = studentRepository.findById(userId);
        if(student.isPresent()){
            return studentMapper.toDTO(student.get());
        }
        else {
            throw new ResourceNotFoundException("Student Not Found");
        }
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void promotingStudents(StudentPromoteRequest studentPromoteRequest) {
        List<Integer> studentIds = studentPromoteRequest.getStudentIdList();
        List<Boolean> promotionStatuses = studentPromoteRequest.getPromoted();

        IntStream.range(0, studentIds.size())
                .filter(i -> promotionStatuses.get(i))
                .forEach(i -> promote(studentIds.get(i),studentPromoteRequest.getToClassId(),studentPromoteRequest.getToSectionId()));
    }

    public void promote(int studentId, int toClassId, int toSectionId) {
        Student student = studentRepository.findById(studentId).get();
        student.setClazz(classRepository.getReferenceById(toClassId));
        student.setSection(sectionRepository.getReferenceById(toSectionId));
        studentRepository.save(student);
    }

    public void refreshStudentEnrollments(Student student, Boolean onlyDelete){
        int studentId = student.getUser().getUserId();
        List<Subject> subjects = student.getClazz().getSubjectList();
        List<StudentEnrollment> existingEnrollments = studentEnrollmentRepository
            .findByStudentId(studentId)
            .get();
        List<Boolean> deleteEntry = Stream
            .generate(() -> true)
            .limit(existingEnrollments.size())
            .collect(Collectors.toList());

        if(!onlyDelete){
            List<Integer> existingSubjIDs = existingEnrollments
                .stream()
                .map(enr -> enr.getSubject().getId())
                .collect(Collectors.toList());
                
            Boolean sectionUpdated = false;
            if(!existingEnrollments.isEmpty()){
                int oldSecId = existingEnrollments.get(0).getSection().getId();
                int newSecId = student.getSection().getId();
                sectionUpdated = oldSecId != newSecId;
            }

            for(Subject subject: subjects){
                int foundIdx = existingSubjIDs.indexOf(subject.getId());
                if(foundIdx != -1){
                    deleteEntry.set(foundIdx, false);
                    if(sectionUpdated){
                        StudentEnrollment enrollment = existingEnrollments.get(foundIdx);
                        enrollment.setSection(student.getSection());
                        studentEnrollmentRepository.save(enrollment);
                    }
                }else{
                    StudentEnrollment enrollment = new StudentEnrollment();
                    enrollment.setStudent(student);
                    enrollment.setSection(student.getSection());
                    enrollment.setSubject(subject);
                    studentEnrollmentRepository.save(enrollment);
                }

            }
        }
        
        for(int i = 0; i < existingEnrollments.size(); i++){
            if(deleteEntry.get(i)){
                int delID = existingEnrollments.get(i).getId();
                studentEnrollmentRepository.deleteById(delID);
            }
        }
    }

    public void refreshAllStudentEnrollments(){
        List<Student> students = studentRepository.findAll();
        for(Student student: students){
            refreshStudentEnrollments(student,false);
        }
    }

    public StudentDTO update(int userId,StudentDTO studentDTO) {
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if(studentOpt.isPresent()) {
            Student student=studentOpt.get();
            student.setDormitory(studentDTO.getDormitory());
            student.setParent(studentDTO.getParent());
            student.setAdmissionNumber(studentDTO.getAdmissionNumber());
            student.setDormitoryNumber(studentDTO.getDormitoryNumber());
            student.setSportsHouse(studentDTO.getSportsHouse());
            student.setYearAdmitted(studentDTO.getYearAdmitted());
            student.setClazz(classRepository.findById(studentDTO.getClassId()).get());
            student.setSection(sectionRepository.findById(studentDTO.getSectionId()).get());
            Student updatedStudent=studentRepository.save(student);
            refreshStudentEnrollments(updatedStudent, false);
            return studentMapper.toDTO(updatedStudent);
        }
        else {
            throw new ResourceNotFoundException("Student Not Found");
        }
    }

    public void delete(int studentId) {
        Optional<Student> student = studentRepository.findById(studentId);;
        if(student.isPresent()) {
            refreshStudentEnrollments(student.get(),true);
            studentRepository.deleteById(studentId);
        }else {
           throw new ResourceNotFoundException("Student Not Found");
        }
    }

}
