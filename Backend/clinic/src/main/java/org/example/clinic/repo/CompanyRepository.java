package org.example.clinic.repo;

import org.example.clinic.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByName(String name);
    
    List<Company> findByIsActiveTrue();
    
    @Query("SELECT c FROM Company c WHERE c.isActive = true ORDER BY c.name")
    List<Company> findAllActiveCompanies();
    
    boolean existsByName(String name);
}
