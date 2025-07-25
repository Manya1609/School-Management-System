import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const Marksheet = ({ marksheetData }) => {
  const componentRef = useRef();

  const handleSavePdf = () => {
    const element = componentRef.current;

    const opt = {
      margin:       [0.5, 0.2, 0.5, 0.2], // Top, left, bottom, right margins in inches
      filename:     `${marksheetData.studentDetails.fullName || 'Student'}_marksheet.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const {
    schoolDetails,
    studentDetails,
    marksData,
    affectiveTraits,
    psychomotorSkills,
    teacherComment,
    principalComment,
    nextTermStartDate,
    nextTermFees
  } = marksheetData;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Save PDF button */}
      <button
        onClick={handleSavePdf}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 self-end"
      >
        Save as PDF
      </button>

      {/* Marksheet content */}
      <div
        ref={componentRef}
        className="marksheet-container max-w-4xl w-full p-8 bg-white shadow-md relative"
      >
        {/* School Details */}
        <h1 className="text-center text-2xl font-bold mb-2 text-blue-900 uppercase">
          {schoolDetails.nameOfSchool || '-'}
        </h1>
        <h2 className="text-center text-xl font-semibold mb-2">
          {schoolDetails.schoolAddress || '-'}
        </h2>
        <h3 className="text-center text-lg mb-4">
          {marksData.examName || 'Report Sheet'}
        </h3>

        {/* Student Details */}
        <div className="text-left mb-6 grid grid-cols-2 gap-4">
          <p>
            <strong>Name:</strong> {studentDetails.fullName || '-'}
          </p>
          <p>
            <strong>Admission No:</strong> {studentDetails.admissionNumber || '-'}
          </p>
          <p>
            <strong>Class:</strong> {studentDetails.className || '-'}
          </p>
          <p>
            <strong>Section:</strong> {studentDetails.sectionName || '-'}
          </p>
          <p>
            <strong>Sports House:</strong> {studentDetails.sportsHouse || '-'}
          </p>
          <p>
            <strong>Exam:</strong> {`${marksData.examName} (${marksData.examTerm})` || '-'}
          </p>
        </div>

        {/* Subjects Table */}
        <TableContainer component={Paper} className="mb-6">
          <Table aria-label="marksheet table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Subjects</strong></TableCell>
                <TableCell align="center"><strong>CA1<br/>(/20)</strong></TableCell>
                <TableCell align="center"><strong>CA2<br/>(/20)</strong></TableCell>
                <TableCell align="center"><strong>Total CA<br/>(/40)</strong></TableCell>
                <TableCell align="center"><strong>Exam<br/>(/60)</strong></TableCell>
                <TableCell align="center"><strong>Final Marks<br/>(/100)</strong></TableCell>
                <TableCell align="center"><strong>Subject<br/>Position</strong></TableCell>
                <TableCell align="center"><strong>Grade</strong></TableCell>
                <TableCell align="center"><strong>Remarks</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marksData.subjectWise.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell>{subject.subjectName || '-'}</TableCell>
                  <TableCell align="center">{subject.score1 ?? '-'}</TableCell>
                  <TableCell align="center">{subject.score2 ?? '-'}</TableCell>
                  <TableCell align="center">{subject.contScore ?? '-'}</TableCell>
                  <TableCell align="center">{subject.score3 ?? '-'}</TableCell>
                  <TableCell align="center">{subject.totalScore ?? '-'}</TableCell>
                  <TableCell align="center">{subject.position || '-'}</TableCell>
                  <TableCell align="center">{subject.gradeName || '-'}</TableCell>
                  <TableCell align="center">{subject.gradeRemark || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total and Average Marks */}
        <div className="text-left mb-6">
          <p>
            <strong>Total Marks Obtained:</strong> {marksData.totalMarks ?? '-'}
          </p>
          <p>
            <strong>Average Marks:</strong> {marksData.avgMarks ?? '-'}
          </p>
          <p>
            <strong>Class Position:</strong> {marksData.position ?? '-'}
          </p>
          <p>
            <strong>Class Average Marks:</strong> {marksData.classAvgMarks ?? '-'}
          </p>
        </div>

        {/* Affective Traits */}
        {affectiveTraits && affectiveTraits.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Affective Traits</h4>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {affectiveTraits.map((trait, index) => (
                    <TableRow key={index}>
                      <TableCell>{trait.name || '-'}</TableCell>
                      <TableCell align="center">{trait.rating || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Psychomotor Skills */}
        {psychomotorSkills && psychomotorSkills.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Psychomotor Skills</h4>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {psychomotorSkills.map((skill, index) => (
                    <TableRow key={index}>
                      <TableCell>{skill.name || '-'}</TableCell>
                      <TableCell align="center">{skill.rating || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Teacher & Principal Comments */}
        <div className="mt-6">
          <p>
            <strong>Class Teacher's Comment:</strong> {teacherComment || '-'}
          </p>
          <p>
            <strong>Principal's Comment:</strong> {principalComment || '-'}
          </p>
        </div>

        {/* Next Term Details */}
        <div className="mt-6">
          <p>
            <strong>Next Term Begins:</strong> {nextTermStartDate || '-'}
          </p>
          <p>
            <strong>Next Term Fees:</strong> {nextTermFees || '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Marksheet;