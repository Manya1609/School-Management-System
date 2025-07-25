package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Integer> {
    Optional<SystemSettings> findFirstByOrderByIdDesc();
}
