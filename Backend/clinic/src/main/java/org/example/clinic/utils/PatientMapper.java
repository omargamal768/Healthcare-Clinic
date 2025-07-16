package org.example.clinic.utils;

import org.example.clinic.dto.PatientDTO;
import org.example.clinic.model.Patient;
import java.util.List;
import java.util.stream.Collectors;

public class PatientMapper {

    public static PatientDTO toDTO(Patient patient) {
        if (patient == null) return null;

        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setMobile(patient.getMobile());
        return dto;
    }

    public static Patient toEntity(PatientDTO dto) {
        if (dto == null) return null;

        Patient patient = new Patient();
        patient.setId(dto.getId());
        patient.setName(dto.getName());
        patient.setMobile(dto.getMobile());
        return patient;
    }

    public static List<PatientDTO> toDTOList(List<Patient> patients) {
        return patients.stream().map(PatientMapper::toDTO).collect(Collectors.toList());
    }
}
