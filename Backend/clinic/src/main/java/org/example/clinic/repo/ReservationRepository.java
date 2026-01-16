package org.example.clinic.repo;

import org.example.clinic.model.Patient;
import org.example.clinic.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByPatientId(Long patientId);
    List<Reservation> findByDate(LocalDate date);
    List<Reservation> findByPatientIdAndDate(Long patientId, LocalDate date);
    // Check if a patient has a reservation on the same date
    boolean existsByPatientIdAndDate(Long patientId, LocalDate date);

    // Check if a turn is already taken on the specific date
    boolean existsByTurnAndDate(int turn, LocalDate date);

    @Query("SELECT r.turn FROM Reservation r WHERE r.date = :date")
    List<Integer> findReservedTurnsByDate(LocalDate date);

    // ✅ This checks if a reservation exists for a patient on a specific date
    boolean existsByPatientAndDate(Patient patient, LocalDate date);

    // ✅ This is used to get turn number by counting reservations on that date
    int countByDate(LocalDate date);
    
    // Company-related queries
    Long countByCompany(org.example.clinic.model.Company company);
    
    Long countByCompanyAndDateBetween(org.example.clinic.model.Company company, LocalDate startDate, LocalDate endDate);
    
    Long countByCompanyAndPapersSentFalseAndDateAfter(org.example.clinic.model.Company company, LocalDate date);
    
    List<Reservation> findByCompanyAndPapersSentFalseAndDateAfter(org.example.clinic.model.Company company, LocalDate date);
    
    List<Reservation> findByCompanyAndDateBetween(org.example.clinic.model.Company company, LocalDate startDate, LocalDate endDate);
}