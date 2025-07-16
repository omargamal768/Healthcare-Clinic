package org.example.clinic.repo;

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

}