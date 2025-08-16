package org.example.clinic.repo;


import org.example.clinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByMobileContaining(String mobile);
    boolean existsByMobile(String mobile);
    List<Patient> findByNameContaining(String name);

}