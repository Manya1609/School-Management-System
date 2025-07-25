package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.managetimetable.ManageTimeTableDTO;
import com.adobe.prj.backend.dto.managetimetable.TimeTablePDF;
import com.adobe.prj.backend.dto.marks.TabulationPDF;
import com.adobe.prj.backend.service.ManageTimeTableService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/api")

public class ManageTimeTableController {

    @Autowired
    private ManageTimeTableService manageTimeTableService;

    @PostMapping("/managetimetable")
    public ResponseEntity<ManageTimeTableDTO> createManageTimeTable(@RequestBody ManageTimeTableDTO manageTimeTableDTO) {
        manageTimeTableService.create(manageTimeTableDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/managetimetable")
    public ResponseEntity<List<ManageTimeTableDTO>> getAllManageTimeTables() {
        List<ManageTimeTableDTO> manageTimeTableDTOList = manageTimeTableService.getAll();
        return new ResponseEntity<>(manageTimeTableDTOList,HttpStatus.OK);
    }
    @PutMapping("/managetimetable/{manageTimeTableId}")
    public ResponseEntity<ManageTimeTableDTO> updateManageTimeTable(@RequestBody ManageTimeTableDTO manageTimeTableDTO){
        manageTimeTableService.update(manageTimeTableDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/managetimetable/{manageTimeTableId}")
    public ResponseEntity<ManageTimeTableDTO> deleteManageTimeTable(@PathVariable int manageTimeTableId){
        manageTimeTableService.delete(manageTimeTableId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/timetablepdf")
    public ResponseEntity<?> timetablePdf(@RequestParam int timeTableId, @RequestParam int systemId){
        List<TimeTablePDF> timeTablePDFList = (List<TimeTablePDF>) manageTimeTableService.getpdf(timeTableId,systemId);
        List<String> timeSlots = timeTablePDFList.stream().map(t->t.getTimeSlot()).distinct().collect(Collectors.toList());

        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(bos);
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument);

        pdfDocument.getDocumentInfo().setTitle("Tabulation Sheet");
        document.setMargins(30, 30, 30, 30);
        Paragraph paragraph = new Paragraph("Time Table for "+timeTablePDFList.get(0).getClassName());
        paragraph.setHorizontalAlignment(HorizontalAlignment.LEFT);
        paragraph.setFontSize(20);
        document.add(paragraph);
// Create a table with the day column and time slot columns
        Table table = new Table(new float[]{1, 2, 3, 4, 5, 6, 7}); // adjust the number of columns as needed
        table.setWidth(100);
        table.setHorizontalAlignment(HorizontalAlignment.CENTER);
        table.setVerticalAlignment(VerticalAlignment.MIDDLE);
        table.setFontSize(14);
        Cell dayCell = new Cell();
        dayCell.add(new Paragraph("Day")).setHorizontalAlignment(HorizontalAlignment.CENTER).setVerticalAlignment(VerticalAlignment.MIDDLE);
        table.addCell(dayCell);

        for (String timeSlot : timeSlots) {
            Cell timeSlotCell = new Cell();
            timeSlotCell.add(new Paragraph(timeSlot));
            timeSlotCell.setHorizontalAlignment(HorizontalAlignment.CENTER);
            timeSlotCell.setVerticalAlignment(VerticalAlignment.MIDDLE);
            table.addCell(timeSlotCell);
        }

        // Add data rows
        for (int day = 1; day <= 6; day++) {
            final int finalDay = day;
            Cell dayDataCell = new Cell().add(new Paragraph(String.valueOf(day))).setHorizontalAlignment(HorizontalAlignment.CENTER).setVerticalAlignment(VerticalAlignment.MIDDLE);
            table.addCell(dayDataCell);

            for (String timeSlot : timeSlots) {
                String subject = timeTablePDFList.stream()
                        .filter(entry -> entry.getDay() == finalDay && entry.getTimeSlot().equals(timeSlot))
                        .findFirst()
                        .map(TimeTablePDF::getSubject)
                        .orElse("");
                Cell subjectCell = new Cell().add(new Paragraph(subject)).setHorizontalAlignment(HorizontalAlignment.CENTER).setVerticalAlignment(VerticalAlignment.MIDDLE);
                table.addCell(subjectCell);
            }
        }


        document.add(table);

        document.close();

        byte[] pdfBytes = bos.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "TimeTable.pdf");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }


}
