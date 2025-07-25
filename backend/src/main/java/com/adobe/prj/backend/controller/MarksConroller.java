package com.adobe.prj.backend.controller;
import com.adobe.prj.backend.dto.marks.TabulationPDF;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.IBlockElement;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
//import com.itextpdf.layout.property.HorizontalAlignment;
//import com.itextpdf.layout.property.VerticalAlignment;

import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;



import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.adobe.prj.backend.dto.marks.MarksDTO;
import com.adobe.prj.backend.dto.marks.TabulationData;
import com.adobe.prj.backend.entity.Marks;
import com.adobe.prj.backend.service.MarksService;
import com.itextpdf.layout.properties.HorizontalAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MarksConroller {

    @Autowired
    MarksService marksService;

    @PostMapping("/classes/{classId}/sections/{sectionId}/subjects/{subjectId}/exams/{examId}/marks")
    public ResponseEntity<Void> postMarks(@RequestBody List<MarksDTO> marksDTOList, @PathVariable("classId") int classId, @PathVariable("sectionId") int sectionId, @PathVariable("subjectId") int subjectId, @PathVariable("examId") int examId){
        marksService.addMarks(marksDTOList,examId,classId,sectionId,subjectId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/classes/{classId}/sections/{sectionId}/subjects/\n" +
            "{subjectId}/exams/{examId}/marks")
    public ResponseEntity<List<MarksDTO>> getAllMarks(@PathVariable("examId") int examId, @PathVariable("sectionId") int sectionId, @PathVariable("classId") int classId, @PathVariable("subjectId") int subjectId){
        List<MarksDTO> marksDTOList = marksService.getMarks(examId,sectionId,classId,subjectId);
        return new ResponseEntity<>(marksDTOList,HttpStatus.OK);
    }



    @PutMapping("/classes/{classId}/sections/{sectionId}/subjects/{subjectId}/exams/{examId}/marks")
    public ResponseEntity<Void> updateMarks(@RequestBody List<MarksDTO> marksDTOList,@PathVariable int classId, @PathVariable int sectionId, @PathVariable int subjectId, @PathVariable int examId){
        marksService.update(marksDTOList,examId,classId,sectionId,subjectId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/tabulation")
    public ResponseEntity<List<TabulationData>> getTotalMarks(@RequestParam int examId, @RequestParam int sectionId, @RequestParam int classId){
        List<TabulationData> tabulationDataList = marksService.getTabulation(examId,sectionId,classId);
        return new ResponseEntity<>(tabulationDataList,HttpStatus.OK);
    }

    @GetMapping("/tabulations-sheet")
    public ResponseEntity<?> getTabulationData(@RequestParam int examId, @RequestParam int sectionId, @RequestParam int classId){
        List<TabulationData> tabulationDataList = marksService.getTabulation(examId,sectionId,classId);
        List<TabulationPDF> tabulationPDFList = marksService.topdfData(tabulationDataList);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(bos);
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument);

        pdfDocument.getDocumentInfo().setTitle("Tabulation Sheet");
        document.setMargins(30, 30, 30, 30);
        Paragraph paragraph = new Paragraph("Tabulation Sheet of "+tabulationPDFList.get(0).getClassName()+" "+tabulationPDFList.get(0).getSectionName());
        paragraph.setHorizontalAlignment(HorizontalAlignment.LEFT);
        paragraph.setFontSize(20);
        document.add(paragraph);

        Table table = new Table(tabulationPDFList.get(0).getSubjectList().size() + 4);
        table.setHorizontalAlignment(HorizontalAlignment.CENTER);
        table.setVerticalAlignment(VerticalAlignment.MIDDLE);
        table.setFontSize(14);
        Cell cell = new Cell();
        cell.add(new Paragraph("#"));
        table.addCell(cell);
        cell = new Cell();
        cell.add(new Paragraph("Student Name"));
        table.addCell(cell);
        for (String subject : tabulationPDFList.get(0).getSubjectList()) {
            cell = new Cell();
            cell.add(new Paragraph(subject));
            table.addCell(cell);
        }
        cell = new Cell();
        cell.add(new Paragraph("Total"));
        table.addCell(cell);
        cell = new Cell();
        cell.add(new Paragraph("Average"));
        table.addCell(cell);
        for (TabulationPDF tabulationPDF : tabulationPDFList) {
            cell = new Cell();
            cell.add(new Paragraph(String.valueOf(tabulationPDF.getId())));
            table.addCell(cell);
            cell = new Cell();
            cell.add(new Paragraph(tabulationPDF.getStudentName()));
            table.addCell(cell);
            for (int totalScore : tabulationPDF.getFinalScores()) {
                cell = new Cell();
                cell.add(new Paragraph(String.valueOf(totalScore)));
                table.addCell(cell);
            }
            cell = new Cell();
            cell.add(new Paragraph(String.valueOf(tabulationPDF.getTotalScore())));
            table.addCell(cell);
            cell = new Cell();
            cell.add(new Paragraph(String.valueOf(tabulationPDF.getAverageScore())));
            table.addCell(cell);

        }

        document.add(table);

        document.close();

        byte[] pdfBytes = bos.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "ReportCard.pdf");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }




}
