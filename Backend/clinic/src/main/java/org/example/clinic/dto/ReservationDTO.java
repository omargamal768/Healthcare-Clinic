package org.example.clinic.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ReservationDTO {
    private Long id;
    private int turn;
    private LocalDate date;
    private String clinicName;
    private String type;
    private String dayOfWeek;
    private boolean cancelled;
    private boolean success;
    private Long patientId;
    private String patientName;
}
