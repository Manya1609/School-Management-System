package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.ManageTimeTable;
import com.adobe.prj.backend.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManageTimeTableRepository extends JpaRepository<ManageTimeTable, Integer> {
    List<TimeSlot> findByTimeTableId(int id);
}
