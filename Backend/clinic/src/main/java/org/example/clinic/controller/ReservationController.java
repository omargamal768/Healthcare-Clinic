package org.example.clinic.controller;
import org.example.clinic.dto.PatientDTO;
import org.example.clinic.dto.ReservationDTO;
import org.example.clinic.model.Patient;
import org.example.clinic.model.Reservation;
import org.example.clinic.services.PatientService;
import org.example.clinic.services.ReservationService;
import org.example.clinic.utils.PatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    private final ReservationService reservationService;
    private final PatientService patientService;

//dependency Injection
    @Autowired
    public ReservationController(ReservationService reservationService, PatientService patientService) {
        this.reservationService = reservationService;
        this.patientService = patientService;}
//*********************************************************************************************************************

//api for return list of all  reservations without any filters
@GetMapping("/")
public ResponseEntity<?> getReservations(
        @RequestParam(value = "patientId", required = false) Long patientId,
        @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

    List<ReservationDTO> reservations = reservationService.getReservations(patientId, date);
    return ResponseEntity.ok(reservations);
}
//****************************************************************************

//api for save new reservation for patient
@PostMapping("/")
public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
    try {
        // Check if patient ID is provided
        if (reservation.getPatient() == null || reservation.getPatient().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Patient ID is required.");
        }

        // Fetch the actual patient from DB
        PatientDTO patientDTO = patientService.findById(reservation.getPatient().getId());
        if (patientDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Patient not found.");
        }

        // Convert PatientDTO to Patient entity
        Patient patientEntity = PatientMapper.toEntity(patientDTO);

        // Set the actual Patient before saving
        reservation.setPatient(patientEntity);

        // Save the reservation
        reservationService.createReservation(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body("✅ تم الحجز بنجاح");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Error: " + e.getMessage());
    }
}

//***************************************************************************************************************

//api for return all reserved turns in the date
    @GetMapping("/reserved-turns")
    public ResponseEntity<List<Integer>> getReservedTurns(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Integer> reservedTurns = reservationService.getReservedTurnsByDate(date);
        return ResponseEntity.ok(reservedTurns);}
//**********************************************************************************************************

//api for delete reservation from the list using reservation ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationService.findById(id);
        if (reservation.isPresent()) {
            reservationService.deleteById(id);return ResponseEntity.ok("Reservation deleted successfully.");}
        else {return ResponseEntity.notFound().build();}}
//*****************************************************************************

//API for make cancelled from false to be true
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {Reservation updatedReservation = reservationService.cancelReservation(id);
            return ResponseEntity.ok(updatedReservation);} catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());}}
//****************************************************************************************

//API For make success from false to true
    @PutMapping("/{id}/success")
    public ResponseEntity<?> successReservation(@PathVariable Long id) {
        try {Reservation updatedReservation = reservationService.successReservation(id);
            return ResponseEntity.ok(updatedReservation);}
        catch (Exception e) {return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());}}
//******************************************************************************************

//API for make cancelled from true to false
    @PutMapping("/{id}/active")
    public ResponseEntity<?> activeReservation(@PathVariable Long id) {
        try {
            Reservation updatedReservation = reservationService.activeReservation(id);
            return ResponseEntity.ok(updatedReservation);} catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());}}
//*********************************************************************************************

}



