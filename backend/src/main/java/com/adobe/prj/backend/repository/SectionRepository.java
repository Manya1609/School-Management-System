package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
    Optional<Section> findById(int sectionId);
    List<Section> findAllByClazzId(int clazzId);
}
