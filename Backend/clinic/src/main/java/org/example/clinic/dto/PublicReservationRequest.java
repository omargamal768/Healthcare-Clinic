package org.example.clinic.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class PublicReservationRequest {
    private String name;
    private String mobile;
    private String clinicName;
    private LocalDate date;

}
