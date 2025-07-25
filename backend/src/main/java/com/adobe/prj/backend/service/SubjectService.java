package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.request.SubjectRequestDTO;
import com.adobe.prj.backend.dto.response.SubjectResponseDTO;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.entity.*;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.ClassMapper;
import com.adobe.prj.backend.mapper.SectionMapper;
import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.mapper.SubjectMapper;
import com.adobe.prj.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;



@Service
public class SubjectService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ClassService  classService;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private TeacherEnrollmentRepository teacherEnrollmentRepository;

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ClassMapper classMapper;
    @Autowired
    private SectionMapper sectionMapper;
    @Autowired
    private StudentMapper studentMapper;

    @Transactional
    public SubjectResponseDTO createSubject(SubjectRequestDTO subjectRequestDTO) {

        // Fetch the teacher from the User ID
        Optional<User> userOpt = userRepository.findById(subjectRequestDTO.getUserId());

        if (!userOpt.isPresent()) {
            System.out.println("Teacher not found for User ID: " + subjectRequestDTO.getUserId());
            return null;
        }
        // Fetch the Class entity
        Class clazz = classRepository.findById(subjectRequestDTO.getClassId())
                .orElseThrow(() -> new EntityNotFoundException("Class not found"));

        // Insert a row into the Subject table
        Subject subject = new Subject();
        subject.setSubjectName(subjectRequestDTO.getSubjectName());
        subject.setShortName(subjectRequestDTO.getShortName());
        subject.setClazz(clazz);

        // Fetch the existing Teacher entity
        Optional<Teacher> teacherOpt = teacherRepository.findByUser(userOpt);
        if (!teacherOpt.isPresent()) {
            throw new ResourceNotFoundException("Teacher entity not found for User ID: " + subjectRequestDTO.getUserId());
        }

        subject.setTeacher(teacherOpt.get());
        Subject savedSubject = subjectRepository.save(subject);


        // Insert a row into the TeacherEnrollment table
        TeacherEnrollment teacherEnrollment = new TeacherEnrollment();
        teacherEnrollment.setTeacher(teacherOpt.get());
        teacherEnrollment.setSubject(savedSubject);
        teacherEnrollment.setClazz(clazz);
//        teacherEnrollment.setClassRoomManagement(savedCrm);
        teacherEnrollmentRepository.save(teacherEnrollment);


         //Insert a row into the StudentEnrollment table
        List<Section> sectionList = classService.getSectionsOfClass(clazz.getId()).stream().map(sectionMapper::toEntity).collect(Collectors.toList());;
        for (Section section: sectionList){
            List<Student> studentList = classService.getStudentsOfClassSection(clazz.getId(), section.getId()).stream().map(studentMapper::toEntity).toList();
            for(Student student : studentList ){
    //            entityManager.merge(student);
    //            Student managedStudent = entityManager.find(Student.class, student.getId());
                StudentEnrollment studentEnrollment = new StudentEnrollment();
                studentEnrollment.setSubject(savedSubject);
                studentEnrollment.setSection(section);
                int studentId = student.getUser().getUserId();
                System.out.println("___________________________"+studentId+"_______________________________________________");
                studentEnrollment.setStudent(studentRepository.findById(studentId).get());
                studentEnrollmentRepository.save(studentEnrollment);
            }
        }

        // Return response DTO
        return subjectMapper.toDto(savedSubject);
    }



    public SubjectResponseDTO getSubjectById(int subjectId) {
        return subjectRepository.findById(subjectId)
                .map(subjectMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    public List<SubjectResponseDTO> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(subjectMapper::toDto)
                .collect(Collectors.toList());
    }

    public SubjectResponseDTO updateSubject(int id, SubjectRequestDTO updateSubjectDTO) {
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));


        existingSubject.setSubjectName(updateSubjectDTO.getSubjectName());
        existingSubject.setShortName(updateSubjectDTO.getShortName());


        Class clazz = classRepository.findById(updateSubjectDTO.getClassId())
                .orElseThrow(() -> new EntityNotFoundException("Class not found"));
        existingSubject.setClazz(clazz);

        Optional<User> teacherUser = userRepository.findById(updateSubjectDTO.getUserId());
        Teacher teacher = teacherRepository.findByUser(teacherUser)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        existingSubject.setTeacher(teacher);
        Subject updatedSubject = subjectRepository.save(existingSubject);


        // Update TeacherEnrollment table
        TeacherEnrollment teacherEnrollment = teacherEnrollmentRepository.findBySubjectAndClass(existingSubject.getId(), existingSubject.getClazz().getId())
                .orElse(new TeacherEnrollment()); // Use an existing TeacherEnrollment record or create a new one
        teacherEnrollment.setTeacher(updatedSubject.getTeacher());
        teacherEnrollment.setSubject(updatedSubject);
        teacherEnrollment.setClazz(updatedSubject.getClazz());

        teacherEnrollmentRepository.save(teacherEnrollment);

        return subjectMapper.toDto(updatedSubject);
    }

    public void deleteSubject(int id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Optional<TeacherEnrollment> teacherEnrollment = teacherEnrollmentRepository.findBySubjectAndClass(subject.getId(), subject.getClazz().getId());
            if (teacherEnrollment.get() != null) {
                teacherEnrollmentRepository.deleteById(teacherEnrollment.get().getTeId());
            }
        // Delete the subject itself
        subjectRepository.deleteById(id);
    }

    public List<SubjectResponseDTO> getSubjectsForUser(int userId) throws AccessDeniedException { // userId must be in db logically.

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<Subject> subjects;

        if (UserRole.TEACHER.equals(user.getRole())) {
            subjects = subjectRepository.findByTeacher_User_userId(userId).get();
        } else if (UserRole.STUDENT.equals(user.getRole())) {
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByStudentId(userId).get();
            subjects = enrollments.stream()
                    .map(StudentEnrollment::getSubject)
                    .collect(Collectors.toList());
        } else {
            throw new AccessDeniedException("User is not a teacher or student");
        }

        // Use the mapper to convert the list of subjects to DTOs
        return subjects.stream()
                .map(subjectMapper::toDto)
                .collect(Collectors.toList());

    }

    public List<SubjectResponseDTO> getAllByClass(int classId) {
        return classRepository.findById(classId).get().getSubjectList().stream().map(subjectMapper::toDto).collect(Collectors.toList());
    }
}
