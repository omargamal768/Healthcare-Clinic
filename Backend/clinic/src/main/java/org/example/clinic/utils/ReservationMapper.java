package org.example.clinic.utils;

import org.example.clinic.dto.ReservationDTO;
import org.example.clinic.model.Reservation;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class ReservationMapper {

    private static final DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEEE");

    public static ReservationDTO toDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setTurn(reservation.getTurn());
        dto.setDate(reservation.getDate());
        dto.setClinicName(reservation.getClinicName());
        dto.setType(reservation.getType());
        dto.setDayOfWeek(reservation.getDate() != null ? reservation.getDate().format(dayFormatter) : "غير محدد");
        dto.setCancelled(reservation.isCancelled());
        dto.setSuccess(reservation.isSuccess());
        dto.setPatientId(reservation.getPatient().getId());
        dto.setPatientName(reservation.getPatient().getName());
        return dto;
    }

    public static List<ReservationDTO> toDTOList(List<Reservation> reservations) {
        return reservations.stream().map(ReservationMapper::toDTO).collect(Collectors.toList());
    }
}
