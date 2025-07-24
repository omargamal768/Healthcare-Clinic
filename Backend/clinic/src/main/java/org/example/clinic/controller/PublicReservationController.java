package org.example.clinic.controller;

import org.example.clinic.dto.PublicReservationRequest;
import org.example.clinic.model.Patient;
import org.example.clinic.model.Reservation;
import org.example.clinic.repo.PatientRepository;
import org.example.clinic.repo.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;

@RestController
@RequestMapping("/api/public")
public class PublicReservationController {
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping("/reserve")
    public ResponseEntity<?> makeReservation(@RequestBody PublicReservationRequest request) {
        if (request.getName() == null || request.getMobile() == null || request.getClinicName() == null || request.getDate() == null) {
            return ResponseEntity.badRequest().body("❌ جميع الحقول مطلوبة!");
        }

        // Check if patient exists
        Patient patient = patientRepository.findByMobileContaining(request.getMobile()).orElseGet(() -> {
            Patient newPatient = new Patient();
            newPatient.setName(request.getName());
            newPatient.setMobile(request.getMobile());
            return patientRepository.save(newPatient);
        });

        // Prevent duplicate reservation on same date
        if (reservationRepository.existsByPatientAndDate(patient, request.getDate())) {
            return ResponseEntity.badRequest().body("❌ لديك بالفعل حجز في هذا التاريخ!");
        }

        // Create reservation
        Reservation res = new Reservation();
        res.setPatient(patient);
        res.setDate(request.getDate());
        res.setClinicName(request.getClinicName());
        res.setType("كشف"); // Or use a default if needed
        res.setCancelled(false);
        res.setSuccess(false);
        res.setTurn(reservationRepository.countByDate(request.getDate()) + 1);
        res.setDayOfWeek(getArabicDayName(request.getDate().getDayOfWeek()));

        reservationRepository.save(res);
        return ResponseEntity.ok("✅ تم إنشاء الحجز بنجاح!");
    }

    private String getArabicDayName(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case SATURDAY -> "السبت";
            case SUNDAY -> "الأحد";
            case MONDAY -> "الاثنين";
            case TUESDAY -> "الثلاثاء";
            case WEDNESDAY -> "الأربعاء";
            case THURSDAY -> "الخميس";
            case FRIDAY -> "الجمعة";
        };
    }
}
